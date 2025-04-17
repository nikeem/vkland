import React, { useEffect, useState } from 'react';
import bridge from '@vkontakte/vk-bridge';
import {
  View,
  Panel,
  PanelHeader,
  Group,
  Button,
  Div,
  Text,
} from '@vkontakte/vkui';

export const App = () => {
  const [userId, setUserId] = useState(null); // ← правильно внутри компонента

  useEffect(() => {
    bridge.send('VKWebAppInit');

    // получаем user_id при загрузке
    bridge.send('VKWebAppGetUserInfo')
      .then((data) => {
        setUserId(data.id);
        console.log('User ID получен:', data.id);
      })
      .catch((error) => {
        console.log('Ошибка получения user_id:', error);
      });
  }, []);

  return (
    <View activePanel="main">
      <Panel id="main">
        <PanelHeader>Добро пожаловать</PanelHeader>
        <Group>
          <Div style={{ textAlign: 'center' }}>
            <img
              src="https://via.placeholder.com/300x150"
              alt="Баннер"
              style={{ width: '100%', borderRadius: 12 }}
            />
            <Text weight="2" style={{ marginTop: 16, fontSize: 20 }}>
              Ваш персональный лендинг
            </Text>
            <Text style={{ marginTop: 8 }}>
              Здесь можно разместить информацию о продукте, кнопки, ссылки и т.п.
            </Text>

           <Button
  size="l"
  stretched
  style={{ marginTop: 16 }}
  onClick={async () => {
    if (!userId) {
      console.warn('user_id пока не получен');
      return;
    }

    try {
      // 1. Проверяем разрешение
      const check = await bridge.send('VKWebAppCheckAllowedMessagesFromGroup', {
        group_id: 92756109,
      });

      if (!check.is_allowed) {
        const allow = await bridge.send('VKWebAppAllowMessagesFromGroup', {
          group_id: 92756109,
        });
        console.log('✅ Разрешение получено:', allow);
      }

      // 2. Добавление в Senler
      const res = await fetch('https://vkland01.vercel.app/api/add-subscriber', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          subscription_id: 3245839,
        }),
      });

      const data = await res.json();
      console.log('📬 Ответ от Senler:', data);

      const result = data.subscribers?.[0];

      if (result?.success) {
        console.log('✅ Пользователь успешно добавлен в Senler!');

        // 3. Отправляем событие "subscribe" в VK Ads
        const eventResult = await bridge.send('VKWebAppTrackEvent', {
          event_name: 'subscribe',
          user_id: String(userId),
        });

        if (eventResult.result) {
          console.log('📈 Событие subscribe отправлено!');
        }
      } else {
        console.warn('⚠️ Пользователь не добавлен в Senler:', result?.error);
      }
    } catch (error) {
      console.error('❌ Ошибка:', error);
    }
  }}
>
  Подписаться на рассылку
</Button>




          </Div>
        </Group>
      </Panel>
    </View>
  );
};
