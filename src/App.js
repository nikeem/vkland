import React, { useEffect } from 'react';
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

const [userId, setUserId] = useState(null);

export const App = () => {
  useEffect(() => {
    bridge.send('VKWebAppInit');
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
    console.log('👆 Кнопка нажата');

    bridge.send('VKWebAppGetUserInfo')
      .then(user => {
        console.log('✅ Получен user_id:', user.id);

        return bridge.send('VKWebAppTrackEvent', {
          event_name: 'take_test',
          user_id: String(user.id),
        });
      })
      .then(response => {
        console.log('📬 Событие отправлено!', response);
      })
      .catch(error => {
        console.error('❌ Ошибка:', error);
      });
  }}
>
  Пройти тест
</Button>



          </Div>
        </Group>
      </Panel>
    </View>
  );
};
