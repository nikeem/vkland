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
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    bridge.send('VKWebAppInit');

    bridge
      .send('VKWebAppGetUserInfo')
      .then((data) => {
        setUserId(data.id);
        console.log('User ID получен:', data.id);
      })
      .catch((error) => {
        console.log('Ошибка получения user_id:', error);
      });
  }, []);

  const handleSubscribe = async () => {
    if (!userId) {
      console.warn('user_id пока не получен');
      return;
    }

    setLoading(true);

    try {
      // 1. Разрешение на сообщения
      try {
        const allow = await bridge.send('VKWebAppAllowMessagesFromGroup', {
          group_id: 92756109,
        });
        console.log('✅ Разрешение на сообщения (или уже было):', allow);
      } catch (e) {
        console.warn('⚠️ Не удалось запросить разрешение:', e);
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
      const result = Array.isArray(data.subscribers) ? data.subscribers[0] : null;

      console.log('📬 Ответ от Senler:', data);

      if (result?.success) {
        console.log('✅ Пользователь добавлен в Senler');

        // 3. Отправка события в VK Ads
        await bridge.send('VKWebAppTrackEvent', {
          event_name: 'subscribe',
          user_id: String(userId),
        });

        // 4. Переход в сообщения
        const launchParams = await bridge.send('VKWebAppGetLaunchParams');
        const platform = launchParams.vk_platform;
        const link = 'https://vk.com/im?sel=-92756109';

        if (platform === 'mobile_android' || platform === 'mobile_iphone') {
          // Мобильное устройство
          await bridge.send('VKWebAppOpenLink', { link });
        } else {
          // Десктоп
          await bridge.send('VKWebAppClose', { status: 'success' });
          setTimeout(() => {
            location.replace(link);
          }, 100); // немного подождать, пока закроется миниапп
        }
      } else {
        console.warn('⚠️ Ошибка добавления в Senler:', result?.error || data);
      }
    } catch (error) {
      console.error('❌ Ошибка при подписке:', error);
    }

    setLoading(false);
  };

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
              loading={loading}
              disabled={loading}
              onClick={handleSubscribe}
            >
              {loading ? 'Обработка...' : 'Подписаться на рассылку'}
            </Button>
          </Div>
        </Group>
      </Panel>
    </View>
  );
};
