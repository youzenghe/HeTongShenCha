const USER_ID_KEY = 'user_id';

/**
 * 硬编码一个公共访客ID，跳过指纹识别
 */
export const identifyUser = async () => {
    const PUBLIC_USER_ID = "public_guest_user"; // 固定公共用户ID
    localStorage.setItem(USER_ID_KEY, PUBLIC_USER_ID);
    console.log(`[User] 使用公共访客ID: ${PUBLIC_USER_ID}`);
    return PUBLIC_USER_ID;
};

/**
 * 直接返回公共访客ID，不检查用户
 */
export const getUserId = () => {
    return "public_guest_user"; // 始终返回相同的ID
};