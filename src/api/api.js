const URL = "https://wedev-api.sky.pro/api/v2/leaderboard";

export const getLeaders = async () => {
  const response = await fetch(URL);
  const data = await response.json();
  if (!response.ok) throw new Error(Object.values(data));

  return data;
};

export const postLeader = async user => {
  const response = await fetch(URL, {
    method: "POST",
    body: JSON.stringify(user),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(Object.values(data));

  return data;
};
