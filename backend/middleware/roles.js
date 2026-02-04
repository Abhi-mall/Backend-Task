export function allowRoles(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });
    if (roles.includes(req.user.role) || req.user.role === 'STATE_MANAGER') {
      return next();
    }
    return res.status(403).json({ message: "insufficient role" });
  };
}
