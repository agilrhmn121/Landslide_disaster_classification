import argparse
import os
from PIL import ImageFile
ImageFile.LOAD_TRUNCATED_IMAGES = True
# Asumsi kamu memisahkan logika di file lain sesuai screenshot VS Code-mu
from dataset import prepare_datasets 
from model_classifier import build_model
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import ModelCheckpoint

def train_model(epochs, batch_size, learning_rate):
    print(f"[*] Memulai training dengan Epochs: {epochs}, Batch Size: {batch_size}, LR: {learning_rate}")
    
    # 1. Tentukan path dataset (sesuaikan dengan struktur folder Laragon-mu)
    dataset_dir = "../dataset" 
    
    # 2. Panggil fungsi dari dataset.py untuk memuat data
    # (Fungsi ini harus kamu buat di dataset.py untuk membaca folder Bencana)
    train_generator, validation_generator = prepare_datasets(dataset_dir, batch_size)
    
   
 # 3. Panggil arsitektur model dari model_classifier.py
    jumlah_kelas = len(train_generator.class_indices)
    model = build_model(num_classes=jumlah_kelas)
    # 4. Konfigurasi Optimizer dan Loss Function
    optimizer = Adam(learning_rate=learning_rate)
    model.compile(
        optimizer=optimizer,
        loss='categorical_crossentropy',
        metrics=['accuracy']
    )
    
    # 5. Buat folder untuk menyimpan model jika belum ada
    if not os.path.exists('../saved_models'):
        os.makedirs('../saved_models')
        
    # Callback untuk menyimpan model terbaik selama training berjalan
    checkpoint = ModelCheckpoint(
        '../saved_models/disaster_model_best.h5', 
        monitor='val_accuracy', 
        save_best_only=True, 
        mode='max'
    )
    
    # 6. MULAI TRAINING
    print("[*] Proses training sedang berjalan...")
    history = model.fit(
        train_generator,
        epochs=epochs,
        validation_data=validation_generator,
        callbacks=[checkpoint]
    )
    
    print("[*] Training selesai! Model terbaik disimpan di 'saved_models/disaster_model_best.h5'")
    
    # Opsional: Simpan log history ke file JSON/CSV agar bisa dibaca oleh Laragon untuk grafik
    return history

if __name__ == '__main__':
    # Setup Argparse agar script ini bisa menerima parameter dari Laragon (PHP)
    parser = argparse.ArgumentParser(description="Script Training Klasifikasi Bencana")
    parser.add_argument('--epochs', type=int, required=True, help="Jumlah Epoch")
    parser.add_argument('--batch_size', type=int, required=True, help="Ukuran Batch")
    parser.add_argument('--learning_rate', type=float, required=True, help="Learning Rate Optimizer")
    
    args = parser.parse_args()
    
    # Jalankan fungsi utama
    train_model(args.epochs, args.batch_size, args.learning_rate)