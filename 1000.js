const express = require('express');
const { IgApiClient } = require('instagram-private-api');

const app = express();

app.get('/followers', async (req, res) => {
  const ig = new IgApiClient();
  const user = 'projectaspects';
  const pwd = 'rtx@1806';

  console.log(user, pwd);
  await ig.state.generateDevice(user);
  await ig.account.login(user, pwd);

  const accounts = ['zgodofficial', 'hastar_og'];
  const accountFollowers = await Promise.all(
    accounts.map(async (account, index) => { 
      const { pk: accountId } = await ig.user.searchExact(account);
      let accountFollowers = [];
      let maxId;
      const feed = ig.feed.accountFollowers(accountId);
      while (accountFollowers.length < 1000) {
        const items = await feed.items({ maxId });
        if (!items || !items.length) break;
        maxId = items[items.length - 1].pk;
        accountFollowers = [...accountFollowers, ...items];
      }
      if (index < accounts.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      return accountFollowers;
    })
  );

  const allFollowers = [...new Set(accountFollowers.flat(1).map(follower => follower.pk))];

  // Count overlaps
  const overlap = [];
  for (const pk of allFollowers) {
    if (accountFollowers.every(followers => followers.some(follower => follower.pk === pk))) {
      overlap.push(pk);
    }
  }

  res.json({
    accounts,
    accountFollowers,
    followersCount: accountFollowers.map(followers => followers.length),
    overlapFollowers: overlap,
    overlapCount: overlap.length
  });
});

app.listen(3000, () => console.log('Server started on port 3000'));
