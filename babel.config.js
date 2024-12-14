module.exports = {
    presets: [
      [
        "@babel/preset-env",
        {
          targets: {
            node: "current", // Target Node.js for Jest
          },
        },
      ],
    ],
  };
  