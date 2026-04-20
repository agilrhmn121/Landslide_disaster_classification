import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.preprocessing.image import ImageDataGenerator
import os
import argparse

# Sembunyikan pesan log TensorFlow yang tidak penting
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

# ==============================================================================
# 1. PENGATURAN HYPERPARAMETER (Parameter Eksternal)
# ==============================================================================
# Membaca perintah dari terminal (argparse)
parser = argparse.ArgumentParser()
parser.add_argument('--epochs', type=int, default=20, help='Jumlah perulangan belajar')
parser.add_argument('--batch_size', type=int, default=32, help='Jumlah gambar per batch')
parser.add_argument('--learning_rate', type=float, default=0.0001, help='Langkah belajar AI')
args = parser.parse_args()

# Pastikan alamat folder dataset ini benar sesuai komputermu
DATA_DIR = r"D:\Landslide_disaster_classification\dataset"

IMG_WIDTH, IMG_HEIGHT = 224, 224 # Ukuran standar gambar untuk MobileNetV2
BATCH_SIZE = args.batch_size     # Mengambil angka dari perintah terminal
EPOCHS = args.epochs             # Mengambil angka dari perintah terminal
LEARNING_RATE = args.learning_rate # Mengambil angka dari perintah terminal

print("=== MEMULAI PROSES TRAINING AI ===")
print(f"[INFO] Setelan aktif: Epochs={EPOCHS}, Batch={BATCH_SIZE}, LR={LEARNING_RATE}")

# ==============================================================================
# 2. PENYIAPAN DATASET & DATA AUGMENTASI (Si Pustakawan)
# ==============================================================================
print("[INFO] Menyiapkan dan Membagi Dataset...")

# Data Augmentasi: Membuat variasi gambar agar AI tidak menghafal (Overfitting)
datagen = ImageDataGenerator(
    rescale=1./255,           # Normalisasi warna piksel (0-255 diubah ke 0-1)
    rotation_range=20,        # Putar gambar maksimal 20 derajat
    width_shift_range=0.2,    # Geser gambar ke kiri/kanan
    height_shift_range=0.2,   # Geser gambar ke atas/bawah
    zoom_range=0.2,           # Zoom in / Zoom out
    horizontal_flip=True,     # Membalikkan gambar seperti cermin
    validation_split=0.2      # KUNCI UTAMA: 80% untuk Belajar (Train), 20% Ujian (Val)
)

# Mengambil 80% data untuk proses belajar AI
train_generator = datagen.flow_from_directory(
    DATA_DIR,
    target_size=(IMG_WIDTH, IMG_HEIGHT),
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    subset='training'
)

# Mengambil sisa 20% data untuk menguji kepintaran AI
val_generator = datagen.flow_from_directory(
    DATA_DIR,
    target_size=(IMG_WIDTH, IMG_HEIGHT),
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    subset='validation'
)

# ==============================================================================
# 3. MEMBANGUN ARSITEKTUR MOBILENET V2 (Si Arsitek Otak)
# ==============================================================================
print("\n[INFO] Membangun Arsitektur MobileNetV2...")

# Memanggil model dasar MobileNetV2 (Transfer Learning)
base_model = MobileNetV2(
    weights='imagenet', # Menggunakan ilmu yang sudah belajar dari jutaan gambar
    include_top=False,  # Membuang lapisan klasifikasi asli milik Google
    input_shape=(IMG_WIDTH, IMG_HEIGHT, 3)
)

# Mengunci ilmu dasar MobileNet agar tidak rusak saat awal training
base_model.trainable = False

# Membangun lapisan baru milik kita sendiri di atas MobileNetV2
model = Sequential([
    base_model,
    GlobalAveragePooling2D(),      # Merangkum jutaan fitur visual menjadi sederhana
    Dense(128, activation='relu'), # Lapisan saraf tersembunyi
    Dropout(0.5),                  # Mematikan 50% saraf acak agar AI tidak menghafal
    Dense(5, activation='softmax') # LAPISAN OUTPUT: 5 Kelas Bencana
])

# Mengkompilasi otak AI dengan Optimizer dan Loss Function
model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=LEARNING_RATE),
    loss='categorical_crossentropy',
    metrics=['accuracy'] # Metrik yang kita pantau adalah Akurasi
)

# ==============================================================================
# 4. PROSES TRAINING (Ruang Kelas AI)
# ==============================================================================
print("\n[INFO] AI Mulai Belajar (Proses Training)...")
history = model.fit(
    train_generator,
    validation_data=val_generator,
    epochs=EPOCHS
)

# ==============================================================================
# 5. MENYIMPAN OTAK AI KE DALAM FILE .h5
# ==============================================================================
# Menyimpan file di folder 'saved_models'
model_save_path = '../../saved_models/disaster_model_best.h5'
os.makedirs(os.path.dirname(model_save_path), exist_ok=True)

model.save(model_save_path)

print(f"\n[SUKSES] 🎉 Training selesai!")
print(f"[SUKSES] Otak AI berhasil disimpan secara fisik di: {model_save_path}")
print("\nUrutan Kelas Bencana yang Dikenali AI:")
print(train_generator.class_indices)