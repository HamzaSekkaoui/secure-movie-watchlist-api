export function authorizeModification(req, res, next) {
  const user = req.user;
  const targetUserId = req.params.userId;

  // Un parent a tous les droits
  if (user && user.role === "parent") {
    return next();
  }

  // Un enfant ne peut modifier que sa propre watchlist
  if (user && user.role === "child" && String(user.id) === String(targetUserId)) {
    return next();
  }

  // Accès refusé pour tout le reste
  return res.status(403).json({ error: "Access denied" });
}