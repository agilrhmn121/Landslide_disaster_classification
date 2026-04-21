import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np
import argparse
import json
import sys
import os
import time

# Sembunyikan pesan log TensorFlow
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

# Tangkap path gambar dari Node.js (Next.js)
parser = argparse.ArgumentParser()
parser.add_argument('--image', type=str, required=True)
args = parser.parse_args()

# Path ke dua model yang sudah di-training
PATH_MOBILENET = os.path.join(os.path.dirname(__file__), '../../saved_models/disaster_model_best.h5')
PATH_VGG16 = os.path.join(os.path.dirname(__file__), '../../saved_models/disaster_model_vgg16.h5')

# Kategori kelas (Pastikan urutannya sama persis dengan saat training!)
# Urutan ini biasanya sesuai abjad nama folder dataset
class_names = ['Drought', 'Land_Slide', 'Non_Damage_Buildings_Street', 'Non_Damage_Wildlife_Forest', 'human']

def predict_image(img_path):
    try:
        # Preprocessing gambar (Sama untuk kedua model agar adil)
        img = image.load_img(img_path, target_size=(224, 224))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array /= 255.0 # Normalisasi 1./255

        # ==========================================
        # 1. EKSEKUSI MOBILENETV2
        # ==========================================
        start_time_mb = time.time()
        model_mb = tf.keras.models.load_model(PATH_MOBILENET)
        pred_mb = model_mb.predict(img_array, verbose=0)
        time_mb = round((time.time() - start_time_mb) * 1000) # dalam milidetik
        
        idx_mb = np.argmax(pred_mb[0])
        conf_mb = float(pred_mb[0][idx_mb]) * 100

        # ==========================================
        # 2. EKSEKUSI VGG16
        # ==========================================
        # Cek apakah file VGG16 sudah ada
        if os.path.exists(PATH_VGG16):
            start_time_vgg = time.time()
            model_vgg = tf.keras.models.load_model(PATH_VGG16)
            pred_vgg = model_vgg.predict(img_array, verbose=0)
            time_vgg = round((time.time() - start_time_vgg) * 1000)
            
            idx_vgg = np.argmax(pred_vgg[0])
            conf_vgg = float(pred_vgg[0][idx_vgg]) * 100
            
            vgg_result = {
                "prediction": class_names[idx_vgg],
                "confidence_percentage": round(conf_vgg, 2),
                "waktu_eksekusi_ms": time_vgg
            }
        else:
            vgg_result = {"error": "Model VGG16 belum di-training."}

        # ==========================================
        # GABUNGKAN KEDUA HASIL
        # ==========================================
        final_result = {
            "status": "success",
            "mobilenet": {
                "prediction": class_names[idx_mb],
                "confidence_percentage": round(conf_mb, 2),
                "waktu_eksekusi_ms": time_mb
            },
            "vgg16": vgg_result
        }
        
        # Cetak output sebagai JSON agar bisa dibaca oleh website
        print(json.dumps(final_result))

    except Exception as e:
        error_result = {"status": "error", "message": str(e)}
        print(json.dumps(error_result))

if __name__ == "__main__":
    predict_image(args.image)