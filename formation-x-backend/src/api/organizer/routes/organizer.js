module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/register',
      handler: 'organizer.register',
      config: {
        auth: false, // public route
      },
    },
  ],
};
