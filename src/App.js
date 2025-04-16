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
  onClick={() => {
    if (userId) {
      bridge.send('VKWebAppTrackEvent', {
        event_name: 'debug_event_654321', // 👈 уникальное имя
        user_id: String(userId),
      })
        .then((data) => {
          if (data.result) {
            console.log('✅ Событие debug_event_654321 отправлено!');
          }
        })
        .catch((error) => {
          console.error('❌ Ошибка отправки события:', error);
        });
    } else {
      console.warn('user_id пока не получен');
    }
  }}
>
  Отправить тестовое событие
</Button>
          </Div>
        </Group>
      </Panel>
    </View>
  );
};
