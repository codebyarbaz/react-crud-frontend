import JWTDecode from "jwt-decode";

export const decodeToken = () => {
  try {
    const token = localStorage.getItem("token");
    if (token && token.length > 50) {
      const tokenData = JWTDecode(token);
      return {
        success: true,
        data: tokenData,
      };
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
};

export const limitText = (name, totalChar) => {
  if (name) {
    let newStr = name;
    if (newStr && newStr.length > totalChar) {
      return `${newStr.substring(0, totalChar)}..`;
    } else {
      return newStr;
    }
  } else {
    return "";
  }
};
