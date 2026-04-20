import os
import sys
import json
import argparse
import numpy as np

# Sembunyikan log TensorFlow yang berantakan agar output ke PHP/Node.js tetap bersih
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
import tensorflow as tf
from tensorflow.keras.preprocessing import image

def predict_disaster(image_path):
    # 1. Pastikan file gambar benar-benar ada
    if not os.path.exists(image_path):
        return json.dumps({"status": "error", "message": f"File gambar tidak ditemukan di: {image_path}"})

    # 2. Path model yang sudah sukses kamu training
    model_path = "../saved_models/disaster_model_best.h5"
    if not os.path.exists(model_path):
        return json.dumps({"status": "error", "message": "Model belum ada! Lakukan training dulu."})

    try:
        # 3. Load model "otak AI" kamu
        model = tf.keras.models.load_model(model_path)

        # 4. Daftar kelas BARU yang sudah difokuskan ke Land Disaster & Bukan Bencana
        # PENTING: Urutan angka (0,1,2,3,4) ini diurutkan berdasarkan ALFABET nama folder saat kamu training
        class_labels = {
            0: 'Drought', 
            1: 'Land_Slide', 
            2: 'Non_Damage_Buildings_Street', 
            3: 'Non_Damage_Wildlife_Forest', 
            4: 'human'
        }

        # 5. Pre-processing Gambar
        # Ukuran dijadikan 224x224
        img = image.load_img(image_path, target_size=(224, 224))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0) # Tambahkan dimensi batch
        img_array /= 255.0 # Normalisasi piksel (0-1) agar AI tidak bingung

        # 6. Lakukan Prediksi
        predictions = model.predict(img_array, verbose=0)
        
        # Ambil nilai tertinggi dari tebakan
        predicted_class_idx = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_class_idx]) * 100

        # 7. Ambil nama kelas berdasarkan index
        result_label = class_labels.get(predicted_class_idx, "Unknown")

        # 8. Kembalikan hasil dalam format JSON
        result = {
            "status": "success",
            "prediction": result_label,
            "confidence_percentage": round(confidence, 2)
        }
        return json.dumps(result)

    except Exception as e:
        return json.dumps({"status": "error", "message": str(e)})

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Script Prediksi Gambar Bencana Darat")
    parser.add_argument('--image', type=str, required=True, help="Path ke file gambar yang mau ditebak")
    args = parser.parse_args()

    # Cetak hasilnya (Sistem web akan menangkap teks print JSON ini)
    print(predict_disaster(args.image))