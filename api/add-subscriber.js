export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { user_id, subscription_id } = req.body;

  const formData = new URLSearchParams();
  formData.append('vk_group_id', '92756109');
  formData.append('access_token', '4fed7bbc7b8ccdbfef334362118c9757d953b8877e8d6e14');
  formData.append('v', '2');
  formData.append('subscription_id', subscription_id);
  formData.append('vk_user_id', user_id);

  try {
    const response = await fetch('https://senler.ru/api/subscribers/add', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();
    return res.status(200).json(result);
  } catch (e) {
    console.error('Ошибка запроса в Senler:', e);
    return res.status(500).json({ error: 'Server error' });
  }
}
