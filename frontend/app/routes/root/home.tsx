import { Button } from "@/components/ui/button";
import type { Route } from "../../+types/root";
import { Link } from "react-router";
import { Rocket } from "lucide-react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Task Tribe" },
    { name: "description", content: "Welcome to Task Tribe!" },
  ];
}

export default function Home() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 text-center p-6">
      {/* Logo / Icon */}
      <div className="flex items-center gap-2 mb-6">
        <Rocket className="h-8 w-8 text-blue-600" />
        <h1 className="text-3xl md:text-4xl font-bold text-blue-700">
          Task Tribe
        </h1>
      </div>

      {/* Tagline */}
      <p className="max-w-md text-gray-600 mb-10 text-sm md:text-base">
        Organize your projects, track progress, and boost team productivity — 
        all in one place.
      </p>

      {/* Buttons */}
      <div className="flex gap-4">
        <Link to="/sign-in">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow-lg transition">
            Login
          </Button>
        </Link>
        <Link to="/sign-up">
          <Button
            variant="outline"
            className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-2 rounded-xl shadow-sm transition"
          >
            Sign Up
          </Button>
        </Link>
      </div>
    </div>
  );
}
