// Test credentials for development
export const TEST_ACCOUNTS = {
  officer: {
    email: "urzednik@gov.pl",
    password: "urzednik123",
    name: "Jan Urzędnik",
  },
  admin: {
    email: "admin@gov.pl",
    password: "admin123",
    name: "Admin System",
  },
  citizen: {
    email: "obywatel@example.com",
    password: "obywatel123",
    name: "Anna Obywatel",
  },
};

// Backend API endpoints to implement
export const BACKEND_ENDPOINTS = {
  // Authentication
  auth: {
    login: "POST /api/auth/login",
    logout: "POST /api/auth/logout",
    validateToken: "GET /api/auth/validate",
  },

  // Users
  users: {
    getProfile: "GET /api/users/profile",
    updateProfile: "PUT /api/users/profile",
    listOfficers: "GET /api/users/officers",
    createOfficer: "POST /api/users/officers",
    updateOfficer: "PUT /api/users/officers/:id",
    deleteOfficer: "DELETE /api/users/officers/:id",
  },

  // Acts
  acts: {
    list: "GET /api/acts",
    getById: "GET /api/acts/:id",
    create: "POST /api/acts",
    update: "PUT /api/acts/:id",
    delete: "DELETE /api/acts/:id",
    getByOfficer: "GET /api/acts/officer/:officerId",
  },

  // Subscriptions
  subscriptions: {
    getMySubscriptions: "GET /api/subscriptions",
    subscribe: "POST /api/subscriptions",
    unsubscribe: "DELETE /api/subscriptions/:id",
  },

  // Comments (Consultations)
  comments: {
    list: "GET /api/acts/:actId/comments",
    create: "POST /api/acts/:actId/comments",
    approve: "PATCH /api/comments/:id/approve",
    delete: "DELETE /api/comments/:id",
  },
};
