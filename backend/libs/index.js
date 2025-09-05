import ActivityLogSchema from "../models/activity.js"

const recordActivity = async (
    userId, 
    action,
    resourceType,
    resourceId,
    details
) => {
    try {
        await ActivityLogSchema.create({
            user: userId,
            action,
            resourceType,
            resourceId,
            details
        })
    } catch (error) {
        
    }
}

export { recordActivity }