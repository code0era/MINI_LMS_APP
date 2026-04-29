export const courseHtmlTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <style>
        :root {
            --primary: #6366f1;
            --surface: #0f172a;
            --surface-card: #1e293b;
            --text-main: #f1f5f9;
            --text-muted: #94a3b8;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: var(--surface);
            color: var(--text-main);
            margin: 0;
            padding: 20px;
            line-height: 1.6;
        }

        .header {
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid var(--surface-card);
        }

        h1 {
            font-size: 24px;
            margin: 0 0 10px 0;
            color: var(--text-main);
        }

        .meta {
            color: var(--text-muted);
            font-size: 14px;
        }

        .video-placeholder {
            width: 100%;
            aspect-ratio: 16/9;
            background-color: var(--surface-card);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 30px;
            position: relative;
            overflow: hidden;
        }

        .play-btn {
            width: 60px;
            height: 60px;
            background-color: var(--primary);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: transform 0.2s;
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
        }

        .play-btn::after {
            content: '';
            display: block;
            border-style: solid;
            border-width: 10px 0 10px 20px;
            border-color: transparent transparent transparent white;
            margin-left: 5px;
        }

        .play-btn:active {
            transform: scale(0.95);
        }

        .content-box {
            background-color: var(--surface-card);
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
        }

        .content-title {
            font-size: 18px;
            font-weight: 600;
            margin: 0 0 10px 0;
            color: var(--primary);
        }

        button.action-btn {
            background-color: var(--primary);
            color: white;
            border: none;
            padding: 15px 20px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            width: 100%;
            cursor: pointer;
            margin-top: 20px;
        }
        
        /* Inject dynamic data targets */
        #course-title:empty::before { content: 'Loading Title...'; color: var(--text-muted); }
        #course-desc:empty::before { content: 'Loading description...'; color: var(--text-muted); }
    </style>
</head>
<body>
    <div class="header">
        <h1 id="course-title"></h1>
        <div class="meta" id="course-meta">Loading details...</div>
    </div>

    <div class="video-placeholder" id="video-container">
        <div class="play-btn" onclick="handlePlay()"></div>
    </div>

    <div class="content-box">
        <h2 class="content-title">About this Module</h2>
        <p id="course-desc"></p>
    </div>

    <button class="action-btn" onclick="handleComplete()">Complete Module</button>

    <script>
        // Communication Bridge to React Native
        function sendMessageToRN(type, payload) {
            if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ type, payload }));
            }
        }

        function handlePlay() {
            sendMessageToRN('VIDEO_PLAY', { timestamp: Date.now() });
            
            const container = document.getElementById('video-container');
            container.innerHTML = '<p style="color: var(--text-muted)">Simulating video playback...</p>';
            
            setTimeout(() => {
                sendMessageToRN('VIDEO_COMPLETE', { timestamp: Date.now() });
            }, 3000);
        }

        function handleComplete() {
            sendMessageToRN('MODULE_COMPLETE', { timestamp: Date.now() });
            document.querySelector('.action-btn').innerHTML = 'Completed ✓';
            document.querySelector('.action-btn').style.backgroundColor = '#22c55e';
        }

        // Global function to be called FROM React Native via injectedJavaScript
        window.injectCourseData = function(courseStr) {
            try {
                const course = JSON.parse(courseStr);
                document.getElementById('course-title').innerText = course.title;
                document.getElementById('course-desc').innerText = course.description;
                document.getElementById('course-meta').innerText = 'Instructor: ' + course.instructor.name;
                
                sendMessageToRN('DATA_LOADED', { success: true });
            } catch (err) {
                sendMessageToRN('ERROR', { message: 'Failed to parse course data' });
            }
        };
    </script>
</body>
</html>
`;
