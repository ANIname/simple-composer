const throwIfTrue = require('../../../src/universal-functions/throw-if-true');

const testPayload = {
  prisma: {
    user: {
      findUnique: {
        result: {
          id:       '6691fb2a-98c3-4143-8fd7-ec6777728357',
          nickName: 'KiiDii',
        },
      },
    },
  },
};

module.exports = async () => {
  expect(() => {
    throwIfTrue('{{ typeof prisma.user.findUnique.result.id !== "string" }}', undefined, 'Test error')(testPayload);
  }).toThrow('Test error');
};
