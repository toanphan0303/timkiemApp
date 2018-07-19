import { Permissions } from 'expo';

export const cameraPermission =  async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    if (status !== 'granted') {
      console.log('no permission cameraPermission');
      return;
    }
      console.log('granted cameraPermission', status);
};
export const storagePermission =  async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== 'granted') {
      console.log('no permission grant storagePermission');
      return;
    }
      console.log('granted storagePermission', status);
};
