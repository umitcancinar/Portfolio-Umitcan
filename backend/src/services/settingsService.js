const { prisma } = require("../config/database");

/**
 * Get site settings (single record, id=1 by convention)
 */
async function get() {
  let settings = await prisma.siteSettings.findFirst();

  // If no settings exist, create defaults
  if (!settings) {
    settings = await prisma.siteSettings.create({
      data: {
        aboutText: "Welcome to my portfolio!",
      },
    });
  }

  return settings;
}

/**
 * Update site settings
 */
async function update(data) {
  let settings = await prisma.siteSettings.findFirst();

  if (!settings) {
    settings = await prisma.siteSettings.create({
      data: {
        ...data,
        aboutText: data.aboutText || "Welcome to my portfolio!",
      },
    });
  } else {
    settings = await prisma.siteSettings.update({
      where: { id: settings.id },
      data,
    });
  }

  return settings;
}

module.exports = { get, update };
