class JwtTokenUtil {
  public static getToken(authorizationHeader: string) {
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
      return authorizationHeader.split(' ')[1];
    }
    return null;
  }
}

export default JwtTokenUtil;
