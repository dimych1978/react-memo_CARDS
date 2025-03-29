const URL = "https://wedev-api.sky.pro/api/v2/leaderboard";

// export const getLeaders = async () => {
//   const response = await fetch(URL);
//   const data = await response.json();
//   if (!response.ok) throw new Error(Object.values(data));

//   return data;
// };
export const getLeaders = async (retries = 3) => {
  try {
    const response = await fetch(URL);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Ошибка ${response.status}: ${Object.values(errorData).join(", ")}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    if (retries > 0 && error.message === "Failed to fetch") {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Ждем 1 секунду
      return getLeaders(retries - 1); // Повторяем запрос
    }
    throw error;
  }
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
