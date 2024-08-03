const URL = "https://wedev-api.sky.pro/api/leaderboard";

export const getLeaders = async () => {
  const fetchLeaders = await fetch(URL);
  const data = await fetchLeaders.json();
  return data;
};

export const postLeader = async user => {
  console.log(user);
  const fetchPost = await fetch(URL, {
    method: "POST",
    body: JSON.stringify(user),
  });
  const data = await fetchPost.json();
  return data;
};
