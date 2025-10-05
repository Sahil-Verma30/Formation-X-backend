'use strict';

module.exports = {
  async register(ctx) {
    try {
      const { username, email, password } = ctx.request.body;

      if (!username || !email || !password) {
        return ctx.badRequest('Missing required fields');
      }

      // Check if user already exists
      const existingUser = await strapi.db.query('plugin::users-permissions.user').findOne({ where: { email } });
      if (existingUser) return ctx.badRequest('Email already registered');

      // Find Organizer role
      const organizerRole = await strapi.db.query('plugin::users-permissions.role').findOne({
        where: { name: 'Organizer' },
      });

      if (!organizerRole) return ctx.badRequest('Organizer role not found');

      // Create user
      const newUser = await strapi.plugins['users-permissions'].services.user.add({
        username,
        email,
        password,
        provider: 'local',
        role: organizerRole.id,
        confirmed: true,
      });

      // Issue JWT
      const jwt = strapi.plugins['users-permissions'].services.jwt.issue({ id: newUser.id });

      ctx.send({
        jwt,
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: 'Organizer',
        },
      });
    } catch (err) {
      console.error('Error creating organizer:', err);
      ctx.internalServerError('Something went wrong');
    }
  },
};
