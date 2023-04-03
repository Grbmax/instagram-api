const express = require('express');
const app = express();
const { IgApiClient } = require('instagram-private-api');

app.get('/followers', async (req, res) => {
  try {
    const ig = new IgApiClient();
    ig.state.generateDevice('projectaspects');
    // ig.state.proxyUrl = process.env.IG_PROXY;
    const auth = await ig.account.login('projectaspects', 'rtx@1806');
    const followersFeed = ig.feed.accountFollowers(auth.pk);
    const wholeResponse = await followersFeed.request();
    console.log(wholeResponse); // You can reach any properties in instagram response
    const items = await followersFeed.items();
    console.log(items); // Here you can reach items. It's array.
    const thirdPageItems = await followersFeed.items();
    // Feed is stateful and auto-paginated. Every subsequent request returns results from next page
    console.log(thirdPageItems); // Here you can reach items. It's array.
    const feedState = followersFeed.serialize(); // You can serialize feed state to have an ability to continue get next pages.
    console.log(feedState);
    followersFeed.deserialize(feedState);
    const fourthPageItems = await followersFeed.items();
    console.log(fourthPageItems);
    // You can use RxJS stream to subscribe to all results in this feed.
    // All the RxJS powerful is beyond this example - you should learn it by yourself.
    followersFeed.items$.subscribe(
      followers => console.log(followers.length),
      error => console.error(error),
      () => console.log('Complete!'),
    );
    res.send(items); // Return the followers list to the client
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong'); // Return an error message to the client
  }
});

app.listen(3000, () => console.log('Server is running on port 3000'));
