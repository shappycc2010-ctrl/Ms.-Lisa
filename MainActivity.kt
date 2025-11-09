package com.shappy.secretary

import android.Manifest
import android.content.Intent
import android.os.Bundle
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import android.widget.Button
import android.widget.TextView

class MainActivity : AppCompatActivity() {
    private lateinit var statusTv: TextView

    private val requestPermissions = registerForActivityResult(
        ActivityResultContracts.RequestMultiplePermissions()
    ) { perms ->
        val ok = perms[Manifest.permission.RECORD_AUDIO] == true
        statusTv.text = if (ok) "Permissions OK" else "Permissions missing"
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(android.R.layout.simple_list_item_1)
        statusTv = TextView(this)
        statusTv.text = "Shappy Secretary (demo)"
        setContentView(statusTv)

        requestPermissions.launch(arrayOf(Manifest.permission.RECORD_AUDIO))
    }
}
