const express = require('express');
const { IgApiClient } = require('instagram-private-api');

const app = express();

app.get('/followers', async (req, res) => {
  const ig = new IgApiClient();
  const user = 'gauraxv';
  const pwd = 'hello@1234';

  await ig.state.generateDevice(user);
  await ig.account.login(user, pwd);

  const accounts = ['zgodofficial', 'hastar_og'];
  const accountFollowers = await Promise.all(
    accounts.map(async (account, index) => { // add index as a parameter
      const { pk: accountId } = await ig.user.searchExact(account);
      let accountFollowers = [];
      let maxId;
      const feed = ig.feed.accountFollowers(accountId);
      for await (const items of feed.items.asPages(20)) { // fetch 2000 followers each
        accountFollowers = [...accountFollowers, ...items];
        maxId = items[items.length - 1].pk;
        if (accountFollowers.length >= 5000) break;
      }
      if (index < accounts.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      return accountFollowers;
    })
  );

  // Combine and remove duplicates
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
