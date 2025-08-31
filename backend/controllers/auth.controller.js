import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Verification from "../models/verification.js";
import { sendEmail } from "../libs/sent-email.js";
import aj from "../libs/arcjet.js";

const registerUser = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    // to check email id provided is invalid or not : arcjet
    const decision = await aj.protect(req, { email });
    console.log("Arcjet decision", decision.isDenied());
    if (decision.isDenied()) {
      res.writeHead(403, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Invalid email address" }));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email address already in use",
      });
    }

    const salt = await bcrypt.genSalt(10); // 10 is saltround : higere - more secure but slower
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
    });

    //! email verification

    const verificationToken = jwt.sign(
      { userId: newUser._id, purpose: "email-verification" },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    await Verification.create({
      userId: newUser._id,
      token: verificationToken,
      expiredAt: new Date(Date.now() + 1 * 60 * 60 * 1000),
    });

    const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    const emailSubject = "Verify your email";
    const emailBody = `<p>Click <a href="${verificationLink}">here</a> to verify your email</p>`;

    const isEmailSent = await sendEmail(email, emailSubject, emailBody);

    if (!isEmailSent) {
      return res.status(500).json({
        message: "failed to send verification email",
      });
    }

    return res.status(201).json({
      message:
        "Verification email sent to your email. Please check and verify your account",
    });
  } catch (error) {
    console.log("Register error : ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        message: "User is not registered with this email or password",
      });
    }
    if (!user.isEmailVerified) {
      const existingVerification = await Verification.findOne({
        userId: user._id,
      });
      if (existingVerification && existingVerification.expiredAt > new Date()) {
        return res.status(400).json({
          message:
            "Email not verified. Please check your email for the verification link",
        });
      } else {
        await Verification.findByIdAndDelete(existingVerification._id);

        const verificationToken = jwt.sign(
          { userId: user._id, purpose: "email-verification" },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        await Verification.create({
          userId: user._id,
          token: verificationToken,
          expiredAt: new Date(Date.now() + 1 * 60 * 60 * 1000),
        });

        const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
        const emailSubject = "Verify your email";
        const emailBody = `<p>Click <a href="${verificationLink}">here</a> to verify your email</p>`;

        const isEmailSent = await sendEmail(email, emailSubject, emailBody);

        if (!isEmailSent) {
          return res.status(500).json({
            message: "failed to send verification email",
          });
        }

        return res.status(201).json({
          message:
            "Verification email sent to your email. Please check and verify your account",
        });
      }
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, purpose: "login" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    user.lastLogin = new Date();
    await user.save();

    const userData = user.toObject();
    delete userData.password;

    return res
      .status(200)
      .json({ message: "Login successfully", token, user: userData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;

    const paylaod = jwt.verify(token, process.env.JWT_SECRET);
    if (!paylaod) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { userId, purpose } = paylaod;
    if (purpose !== "email-verification") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const verification = await Verification.findOne({
      userId,
      token,
    });

    if (!verification) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const isTokenExpired = verification.expiredAt < new Date();

    if (isTokenExpired) {
      return res.status(401).json({ message: "Token expired" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({ message: "Email already verified" });
    }
    user.isEmailVerified = true;
    await user.save();

    await Verification.findByIdAndDelete(verification._id);

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const resetPasswordRequest = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({
          message: "User is not registered with this email or password",
        });
    }
    if (!user.isEmailVerified) {
      return res
        .status(400)
        .json({ message: "Please verify your email first" });
    }

    const existingVerification = await Verification.findOne({
      userId: user._id,
    });

    if (existingVerification && existingVerification > new Date()) {
      return res.status(400).json({
        message: "Request password requent already sent to email.",
      });
    }

    if (existingVerification && existingVerification.expiredAt < new Date()) {
      return Verification.findByIdAndDelete(existingVerification._id);
    }

    const resetPasswordToken = jwt.sign(
      { userId: user._id, purpose: "reset-password" },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    await Verification.create({
      userId: user._id,
      token: resetPasswordToken,
      expiredAt: new Date(Date.now() + 15 * 60 * 1000),
    });

    const resetPasswordLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetPasswordToken}`;
    const emailSubject = "Reset your password";
    const emailBody = `<p>Click <a href="${resetPasswordLink}">here</a> to reset your password</p>`;

    const isEmailSent = await sendEmail(email, emailSubject, emailBody);

    if (!isEmailSent) {
      return res.status(500).json({
        message: "Failed to send reset password email",
      });
    }

    return res.status(200).json({
      message:
        "Reset password email sent. Please check your email or spam folder.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const verifyResetPasswordTokenAndResetPassword = async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body

    // 1. Verify token
    let payload
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET)
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" })
    }

    if (!payload) return res.status(401).json({ message: "Unauthorized" })

    const { userId, purpose } = payload

    if (purpose !== "reset-password") {
      return res.status(401).json({ message: "Unauthorized" })
    }

    // 2. Check verification entry
    const verification = await Verification.findOne({ userId, token })
    if (!verification) {
      return res.status(404).json({ message: "Verification record not found" })
    }

    if (verification.expiredAt < new Date()) {
      return res.status(401).json({ message: "Token expired" })
    }

    // 3. Find user
    const user = await User.findById(userId)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // 4. Check password match
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" })
    }

    // 5. Hash new password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    user.password = hashedPassword
    await user.save()

    // 6. Delete verification record
    await Verification.findByIdAndDelete(verification._id)

    return res.status(200).json({ message: "Password reset successfully" })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "Internal server error" })
  }
}


export {
  registerUser,
  loginUser,
  verifyEmail,
  resetPasswordRequest,
  verifyResetPasswordTokenAndResetPassword
};
