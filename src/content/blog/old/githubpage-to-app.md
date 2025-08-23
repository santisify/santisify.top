---
title: '将Github pages打包为移动端应用'
tags: ['android', '技术']
publishDate: '2025-01-18 01:28:14'
description: ''
heroImage: { src: './iv/logo.svg', color: '#4891B2' }
language: 'zh-cn'
---
## 配置环境

首先我们得先配置好环境 </br>
我这里用的是IDEA,也可以用android studio

首先在IDEA中安装一个叫Android的插件
![image.png](https://s2.loli.net/2025/01/18/YuBtGxPNjUenr6q.png)
下载好后我们需要创建项目
![image.png](https://s2.loli.net/2025/01/18/HjckQeP8LGXhWMi.png)
框选的位置一定要修改(language有误，应该选择kotlin) 
![image.png](https://s2.loli.net/2025/01/18/aPnIcXe45WJU8xl.png)
可能会提示下载SDK，直接下载就行了</br>
创建好后，我们需要修改gradle镜像源
![image.png](https://s2.loli.net/2025/01/18/BgOMHLoG7StkyQf.png)
将框选的地址换为
``` bash
https://mirrors.cloud.tencent.com/gradle/gradle-8.2-all.zip
```
修改后，重新加载gradle项目即可

## 项目搭建
首先我们找到文件`app\src\main\java\com\example\myapplication\MainActivity`</br>
若没有修改项目名称，那路径就和我一样的
![image.png](https://s2.loli.net/2025/01/18/jw8aYu3sxOZClW1.png)
将以下代码复制到上面的文件中,项目名称不同下述代码的第一行不用复制，粘贴的时候要保留原有的第一行
```kotlin
package com.example.myapplication

import android.annotation.SuppressLint
import android.app.AlertDialog
import android.os.Bundle
import android.util.Log
import android.view.View
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout
import java.util.concurrent.LinkedBlockingQueue
import java.util.concurrent.RejectedExecutionException
import java.util.concurrent.ThreadPoolExecutor
import java.util.concurrent.TimeUnit


class MainActivity : ComponentActivity() {

    private lateinit var webView: WebView
    private lateinit var swipeRefreshLayout: SwipeRefreshLayout
    private val executor = ThreadPoolExecutor(
        2, // 核心线程数
        4, // 最大线程数
        30L, TimeUnit.SECONDS, // 空闲线程存活时间
        LinkedBlockingQueue(20) // 任务队列容量
    )

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        showWelcomeDialog()

        // 初始化 SwipeRefreshLayout 和 WebView
        swipeRefreshLayout = findViewById(R.id.swipeRefreshLayout)
        webView = findViewById(R.id.webview)

        // 配置 SwipeRefreshLayout
        swipeRefreshLayout.setOnRefreshListener {
            webView.reload() // 刷新网页
        }

        // 配置 WebView
        val webSettings = webView.settings
        webSettings.javaScriptEnabled = true
        webSettings.domStorageEnabled = true
        webSettings.databaseEnabled = true
        webSettings.setSupportMultipleWindows(true)
        webSettings.cacheMode = WebSettings.LOAD_DEFAULT
        webView.setLayerType(View.LAYER_TYPE_HARDWARE, null) // 启用硬件加速

        // 设置 WebViewClient
        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val url = request?.url.toString()
                view?.loadUrl(url)
                return true
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                swipeRefreshLayout.isRefreshing = false // 停止刷新动画
            }
        }

        // 加载你的博客网址
        webView.loadUrl("https://anzhiyublog.lazy-boy-acmer.cn")
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        if (::webView.isInitialized && webView.canGoBack()) {
            Log.d("WebView", "Can go back")
            webView.goBack()
        } else {
            Log.d("WebView", "Not going back")
            super.onBackPressed()
        }
    }

    // 显示欢迎提示框
    private fun showWelcomeDialog() {
        val builder = AlertDialog.Builder(this)
        builder.setTitle("\uD83E\uDD74提示")
        builder.setMessage("返回键已修复为可返回之前页面\n现无法跳转外部页面")

        builder.setPositiveButton("确定") { dialog, _ ->
            dialog.dismiss()
        }

        val dialog = builder.create()
        dialog.show()
    }

    // 任务入队
    fun enqueueTriggerTask(task: Runnable): Boolean {
        return try {
            executor.execute(task)
            true
        } catch (e: RejectedExecutionException) {
            Log.e("TaskManager", "Failed to enqueue task", e)
            false
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        executor.shutdown()
    }
}
```

打开文件 `app\src\main\res\layout\activity_main.xml`
![image.png](https://s2.loli.net/2025/01/18/VDlGNUHtMqvuFiO.png)
粘贴以下代码
```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
                android:layout_width="match_parent"
                android:layout_height="match_parent">

    <androidx.swiperefreshlayout.widget.SwipeRefreshLayout
            android:id="@+id/swipeRefreshLayout"
            android:layout_width="match_parent"
            android:layout_height="match_parent">

        <WebView
                android:id="@+id/webview"
                android:layout_width="match_parent"
                android:layout_height="match_parent"/>
    </androidx.swiperefreshlayout.widget.SwipeRefreshLayout>
</RelativeLayout>
```

## 生成apk
点击菜单栏的 ``Build -> Build Apk(s)``</br>
生成的安装包会在项目根目录下的**app\build\outputs\apk\debug**里面</br>
至于如何修改Apk的名称和图标，大家可以自行百度或AI


