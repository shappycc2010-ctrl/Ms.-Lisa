package com.shappy.secretary

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Intent
import android.os.Build
import android.os.IBinder
import androidx.core.app.NotificationCompat
import kotlinx.coroutines.*

class WakeService : Service() {
    private val CHANNEL_ID = "wake_channel"
    private var job: Job? = null

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
        startForeground(1, buildNotification("Listening for wake word..."))

        job = CoroutineScope(Dispatchers.IO).launch {
            while (isActive) {
                delay(5000)
                // Placeholder: integrate a wake-word engine here (Porcupine/VOSK)
                onWakeWordDetected()
            }
        }
    }

    private fun onWakeWordDetected() {
        val nm = getSystemService(NotificationManager::class.java)
        nm?.notify(2, buildNotification("Wake detected — verify speaker"))
        // In production: capture audio, compute embedding, compare with stored voiceprint
    }

    private fun buildNotification(text: String): Notification {
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Shappy Assistant")
            .setContentText(text)
            .setSmallIcon(android.R.drawable.ic_btn_speak_now)
            .build()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val nm = getSystemService(NotificationManager::class.java) as NotificationManager
            val channel = NotificationChannel(CHANNEL_ID, "Wake Channel", NotificationManager.IMPORTANCE_LOW)
            nm.createNotificationChannel(channel)
        }
    }

    override fun onDestroy() {
        job?.cancel()
        super.onDestroy()
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
