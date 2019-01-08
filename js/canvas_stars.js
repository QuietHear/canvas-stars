//定义画板对象
let c = $('#c')[0],
    ctx = c.getContext("2d");//定义画笔

//定义变量
let leftMargin = 30,//图像相对画板左边框距离，不包括外层圆
    topMargin = 30,//图像相对画板上边框距离，不包括外层圆
    r = 120,//包裹三角形内层圆的半径
    outR = 140,//外层圆半径
    status,//两个点的状态
    step = 3,//步数，决定每次画图的距离
    timer,//画点的定时器
    timeSpacing = 10,//定时器执行间隔
    nowX_A, nowY_A,//当前第一个点的坐标
    nowX_B, nowY_B,//当前二一个点的坐标
    radA, radB,//内圈A,B的当前角度
    radAOut, radBOut;//外圈A,B的当前角度

//计算出来的变量
let centerX = leftMargin + r,//图像中心点x坐标
    centerY = topMargin + r,//图像中心点y坐标
    firstX_A = centerX + r * Math.sqrt(3) / 2,//A第一个点坐标
    firstY_A = centerY - r / 2,
    secondX_A = centerX - r * Math.sqrt(3) / 2,//A第二个点坐标
    secondY_A = centerY - r / 2,
    thirdX_A = centerX,//A第三个点坐标
    thirdY_A = centerY + r,
    firstX_B = centerX - r * Math.sqrt(3) / 2,//B第一个点坐标
    firstY_B = centerY + r / 2,
    secondX_B = centerX + r * Math.sqrt(3) / 2,//B第二个点坐标
    secondY_B = centerY + r / 2,
    thirdX_B = centerX,//B第三个点坐标
    thirdY_B = centerY - r,
    radA_min = -210,//A的角度范围
    radA_max = -30,
    radB_min = -30,//B的角度范围
    radB_max = 150,
    a = 5;

//初始化数据
nowX_A = firstX_A;
nowY_A = firstY_A;
nowX_B = firstX_B;
nowY_B = firstY_B;
radA = radA_max;
radAOut = radA_min;
radB = radB_max;
radBOut = radB_min;
status = 1;
ctx.strokeStyle = 'rgb(255,255,255)';//定义画笔颜色
ctx.shadowBlur = 5;
ctx.shadowColor = "rgba(255,255,255,0.1)";
ctx.lineWidth = 3;//定义画笔宽度

//画初始点
ctx.moveTo(nowX_A, nowY_A);
ctx.lineTo(nowX_A, nowY_A + 1);

ctx.moveTo(nowX_B, nowY_B);
ctx.lineTo(nowX_B, nowY_B + 1);
ctx.stroke();

//根据当前状态执行不同操作
let modeChange = () => {
    if (status === 1) {//画三角第一步
        timer = setInterval(() => {
            //画A 向左
            ctx.moveTo(nowX_A, nowY_A);
            nowX_A -= step;
            if (nowX_A <= secondX_A) {//检测是否结束第一步
                nowX_A = secondX_A;
                status = 2;
            }
            ctx.lineTo(nowX_A, nowY_A);
            //画B 向右
            ctx.moveTo(nowX_B, nowY_B);
            nowX_B += step;
            if (nowX_B >= secondX_B) {//检测是否结束第一步
                nowX_B = secondX_B;
            }
            ctx.lineTo(nowX_B, nowY_B);
            ctx.stroke();
            if (status === 2) {//第一步结束
                clearInterval(timer);
                modeChange();
            }
        }, timeSpacing);
    }
    else if (status === 2) {//画三角第二步
        timer = setInterval(() => {
            //画A 向右下
            ctx.moveTo(nowX_A, nowY_A);
            nowX_A += step / 2;
            nowY_A += step * Math.sqrt(3) / 2;
            if (nowX_A >= thirdX_A) {//检测是否结束第二步
                nowX_A = thirdX_A;
                nowY_A = thirdY_A;
                status = 3;
            }
            ctx.lineTo(nowX_A, nowY_A);
            //画B 向左上
            ctx.moveTo(nowX_B, nowY_B);
            nowX_B -= step / 2;
            nowY_B -= step * Math.sqrt(3) / 2;
            if (nowX_B <= thirdX_B) {//检测是否结束第二步
                nowX_B = thirdX_B;
                nowY_B = thirdY_B;
            }
            ctx.lineTo(nowX_B, nowY_B);
            ctx.stroke();
            if (status === 3) {//第二步结束
                clearInterval(timer);
                modeChange();
            }
        }, timeSpacing);
    }
    else if (status === 3) {//画三角第三步
        timer = setInterval(() => {
            //画A 向右上
            ctx.moveTo(nowX_A, nowY_A);
            nowX_A += step / 2;
            nowY_A -= step * Math.sqrt(3) / 2;
            if (nowX_A >= firstX_A) {//检测是否结束第三步
                nowX_A = firstX_A;
                nowY_A = firstY_A;
                status = 4;
            }
            ctx.lineTo(nowX_A, nowY_A);
            //画B 向左下
            ctx.moveTo(nowX_B, nowY_B);
            nowX_B -= step / 2;
            nowY_B += step * Math.sqrt(3) / 2;
            if (nowX_B <= firstX_B) {//检测是否结束第三步
                nowX_B = firstX_B;
                nowY_B = firstY_B;
            }
            ctx.lineTo(nowX_B, nowY_B);
            ctx.stroke();
            if (status === 4) {//第三步结束
                clearInterval(timer);
                modeChange();
            }
        }, timeSpacing);
    }
    else if (status === 4) {
        timer = setInterval(() => {
            //画内A 逆时针上部分
            ctx.beginPath();
            radA -= (180 * step) / (Math.PI * r);
            if (radA <= radA_min - 50) {//检测是否结束第四步
                radA = radA_min;
                status = 5;
            }
            ctx.arc(centerX, centerY, r, getRads(radA_max), getRads(radA), true);
            ctx.stroke();
            ctx.closePath();
            //画外A 顺时针下部分
            ctx.beginPath();
            radAOut += (180 * step) / (Math.PI * r);
            if (radAOut >= radA_max + 50) {//检测是否结束第一步
                radAOut = radA_max;
            }
            ctx.arc(centerX, centerY, outR, getRads(radA_min), getRads(radAOut));
            ctx.stroke();
            ctx.closePath();
            //画内B 逆时针下部分
            ctx.beginPath();
            radB -= (180 * step) / (Math.PI * r);
            if (radB <= radB_min - 50) {//检测是否结束第一步
                radB = radB_min;
            }
            ctx.arc(centerX, centerY, r, getRads(radB_max), getRads(radB), true);
            ctx.stroke();
            ctx.closePath();
            //画外B 顺时针上部分
            ctx.beginPath();
            radBOut += (180 * step) / (Math.PI * r);
            if (radBOut >= radB_max + 50) {//检测是否结束第一步
                radBOut = radB_max;
            }
            ctx.arc(centerX, centerY, outR, getRads(radB_min), getRads(radBOut));
            ctx.stroke();
            ctx.closePath();
            if (status === 5) {//第一步结束
                clearInterval(timer);
            }
        }, timeSpacing);
    }
};

//度数转弧度
let getRads = (degrees) => {
    return (Math.PI * degrees) / 180;
};

modeChange();