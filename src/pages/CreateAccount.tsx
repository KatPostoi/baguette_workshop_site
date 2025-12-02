import { useState } from 'react';
import { Button } from '../components/ui-kit/Button';

export const Menu = () => {
  const [isloading, setLoading] = useState(false);
  return (
    <div>
      <Button
        loading={isloading}
        onClick={async () => {
          console.log('Hello');
          setLoading(true);

          // await new Promise<void>((resolve, _) => {
          //   setTimeout(() => resolve(), 1000);
          // });

          // await fetch('/api/save-data', {
          //   name: 'Alex',
          // });

          setLoading(false);
        }}
      >
        Сохранить
      </Button>
    </div>
    // </div>
  );
};
