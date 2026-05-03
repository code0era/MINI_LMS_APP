export const courseHtmlTemplate = `
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <style>
        :root {
            --primary: #4db6ac;
            --surface: #ffffff;
            --surface-card: #f8fafc;
            --text-main: #0f172a;
            --text-muted: #64748b;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            background-color: var(--surface);
            color: var(--text-main);
            margin: 0;
            padding: 24px;
            line-height: 1.6;
        }

        .header {
            margin-bottom: 30px;
            padding-bottom: 24px;
            border-bottom: 1px solid #f1f5f9;
        }

        h1 {
            font-size: 28px;
            font-weight: 900;
            margin: 0 0 12px 0;
            color: var(--text-main);
            line-height: 1.2;
        }

        .meta {
            color: var(--text-muted);
            font-size: 12px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }

        .video-wrapper {
            width: 100%;
            aspect-ratio: 16/9;
            background-color: #000;
            border-radius: 24px;
            overflow: hidden;
            margin-bottom: 32px;
            box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
        }

        video {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .content-box {
            background-color: var(--surface-card);
            border-radius: 24px;
            padding: 24px;
            margin-bottom: 24px;
            border: 1px solid #f1f5f9;
        }

        .content-title {
            font-size: 18px;
            font-weight: 800;
            margin: 0 0 12px 0;
            color: var(--primary);
            text-transform: uppercase;
            letter-spacing: 0.025em;
        }
        
        p#course-desc {
            margin: 0;
            font-size: 15px;
            color: #475569;
            font-weight: 500;
        }

        .action-btn {
            background-color: var(--primary);
            color: white;
            border: none;
            padding: 20px 24px;
            border-radius: 24px;
            font-size: 16px;
            font-weight: 900;
            width: 100%;
            cursor: pointer;
            margin-top: 20px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            box-shadow: 0 10px 15px -3px rgba(77, 182, 172, 0.3);
            transition: all 0.2s;
        }
        
        .action-btn:active {
            transform: scale(0.98);
            opacity: 0.9;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 id="course-title"></h1>
        <div class="meta" id="course-meta">Loading details...</div>
    </div>

    <div class="video-wrapper">
        <video 
            id="main-video" 
            controls 
            playsinline
            poster="https://images.unsplash.com/photo-1452784444945-3f422708fe5e?q=80&w=1000&auto=format&fit=crop"
        >
            <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4">
            Your browser does not support the video tag.
        </video>
    </div>

    <div class="content-box">
        <h2 class="content-title">About this Module</h2>
        <p id="course-desc"></p>
    </div>

    <button class="action-btn" id="complete-btn" onclick="handleComplete()">Complete Module</button>

    <script>
        const video = document.getElementById('main-video');

        function sendMessageToRN(type, payload) {
            const data = JSON.stringify({ type, payload });
            if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(data);
            } else if (window.parent) {
                window.parent.postMessage(data, "*");
            }
        }

        video.onplay = () => sendMessageToRN('VIDEO_PLAY', { timestamp: Date.now() });
        video.onended = () => sendMessageToRN('VIDEO_COMPLETE', { timestamp: Date.now() });
        video.onerror = () => sendMessageToRN('ERROR', { message: 'Video failed to load' });

        function handleComplete() {
            sendMessageToRN('MODULE_COMPLETE', { timestamp: Date.now() });
            const btn = document.getElementById('complete-btn');
            btn.innerHTML = 'Completed ✓';
            btn.style.backgroundColor = '#2dd4bf';
        }

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
