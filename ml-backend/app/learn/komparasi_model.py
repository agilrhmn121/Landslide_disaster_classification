import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
import numpy as np
import os

# Sembunyikan pesan log TensorFlow agar terminal tetap bersih
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

# ==============================================================================
# 1. KONFIGURASI ALAMAT FILE (Sesuaikan jika perlu)
# ==============================================================================
DATA_DIR = r"D:\Landslide_disaster_classification\dataset"
PATH_MOBILENET = "../../saved_models/disaster_model_best.h5"
PATH_VGG16     = "../../saved_models/disaster_model_vgg16.h5" 

IMG_WIDTH, IMG_HEIGHT = 224, 224
BATCH_SIZE = 32

print("=== MEMULAI PENGUJIAN KOMPARASI ALGORITMA ===")
print("Harap tunggu, sedang memuat dataset ujian...")

# ==============================================================================
# 2. SIAPKAN DATA UJIAN (VALIDATION SET)
# ==============================================================================
# shuffle=False sangat penting agar kunci jawaban tidak teracak
val_datagen = ImageDataGenerator(rescale=1./255, validation_split=0.2)

val_generator = val_datagen.flow_from_directory(
    DATA_DIR,
    target_size=(IMG_WIDTH, IMG_HEIGHT),
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    subset='validation',
    shuffle=False 
)

true_labels = val_generator.classes

# ==============================================================================
# 3. FUNGSI UNTUK MENGHITUNG METRIK
# ==============================================================================
def get_model_metrics(model_path, model_name):
    if not os.path.exists(model_path):
        return {"Model": model_name, "Status": "Belum ditraining"}

    print(f"\n[INFO] AI {model_name} sedang mengerjakan soal ujian...")
    model = tf.keras.models.load_model(model_path)
    
    # AI menebak gambar
    predictions = model.predict(val_generator, verbose=0)
    predicted_labels = np.argmax(predictions, axis=1)

    # Menghitung Metrik Evaluasi (Menggunakan 'macro' agar semua kelas dihitung adil)
    acc = accuracy_score(true_labels, predicted_labels) * 100
    prec = precision_score(true_labels, predicted_labels, average='macro', zero_division=0) * 100
    rec = recall_score(true_labels, predicted_labels, average='macro', zero_division=0) * 100
    f1 = f1_score(true_labels, predicted_labels, average='macro', zero_division=0) * 100
    
    return {
        "Model": model_name,
        "Accuracy": acc,
        "Precision": prec,
        "Recall": rec,
        "F1-Score": f1,
        "Status": "Sukses"
    }

# ==============================================================================
# 4. EKSEKUSI DAN CETAK TABEL PERBANDINGAN
# ==============================================================================
hasil_mobilenet = get_model_metrics(PATH_MOBILENET, "MobileNetV2")
hasil_vgg16 = get_model_metrics(PATH_VGG16, "VGG16")

print("\n" + "="*75)
print(f"{'TABEL PERBANDINGAN PERFORMA ALGORITMA AI':^75}")
print("="*75)
print(f"| {'Model':<15} | {'Accuracy (%)':<12} | {'Precision (%)':<13} | {'Recall (%)':<10} | {'F1-Score (%)':<12} |")
print("-" * 75)

# Fungsi untuk mencetak baris tabel
def print_row(hasil):
    if hasil["Status"] == "Sukses":
        print(f"| {hasil['Model']:<15} | {hasil['Accuracy']:>12.2f} | {hasil['Precision']:>13.2f} | {hasil['Recall']:>10.2f} | {hasil['F1-Score']:>12.2f} |")
    else:
        print(f"| {hasil['Model']:<15} | {'--- File .h5 Belum Ditemukan / Belum Ditraining ---':^53} |")

# Cetak hasil ke dalam tabel
print_row(hasil_mobilenet)
print_row(hasil_vgg16)
print("="*75)
print("Catatan: Nilai di atas menggunakan rata-rata 'macro' untuk multi-kelas.")