from tensorflow import keras
import numpy as np
model= keras.models.load_model('./model')
print('---------------[INFO]modelloaded---------------')




def predict(imageData):
    np_imageData = np.swapaxes(np.array(imageData),0,1)
    np_imageData = np.expand_dims(np_imageData,0)
    prediction = model.predict(np_imageData)
    return prediction.tolist()