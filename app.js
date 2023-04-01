const express = require('express');
const { IgApiClient } = require('instagram-private-api');
const app = express();

app.get('/overlapping-followers', async (req, res) => {
  const ig = new IgApiClient();
  const user = 'user';
  const pwd = 'pwd';

  const a1 = 'zgodofficial';
  const a2 = 'hastar_og';

  await ig.state.generateDevice(user);
  await ig.account.login(user, pwd);

  const { pk: account1Id } = await ig.user.searchExact(a1);
  const { pk: account2Id } = await ig.user.searchExact(a2);
  
  const account1Followers = await ig.feed.accountFollowers(account1Id).items();
  const account2Followers = await ig.feed.accountFollowers(account2Id).items();
  
  const overlappingFollowers = account1Followers.filter(
    (follower1) => account2Followers.some((follower2) => follower2.pk === follower1.pk));



  res.json({ overlappingFollowersCount: overlappingFollowers.length });
});

app.listen(3000, () => console.log('Server started on port 3000'));
