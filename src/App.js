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
    if (userId) {
      bridge.send('VKWebAppTrackEvent', {
        event_name: 'take_test',
        user_id: String(userId), // обязательно как строка
      })
      .then((data) => {
        if (data.result) {
          console.log('Событие отправлено!');
        }
      })
      .catch((error) => {
        console.log('Ошибка отправки события:', error);
      });
    } else {
      console.log('user_id пока не получен');
    }
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
