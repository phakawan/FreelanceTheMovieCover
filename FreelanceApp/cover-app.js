/** Create by GTH **/

app.controller('coverController',function($scope,Facebook,$timeout,$interval){
    $scope.isLogin = LoginStatus.checked;
    $scope.loadingText = "loading";
    $scope.indexOfCover = 1;
    $scope.mock = 1;
    $scope.result = {
        title:'ระบุชื่อ',
        subtitle:'ระบุอาชีพ สถานะ หรืออะไรก็ได้',
        tagText:"#ติดHashTagเกร๋ๆ (หรือไม่ใส่ก็ได้นะ)#ถ้าฟ้อนประหลาดรอแป๊ปโหลดฟ้อนอยู่",
        msg:""
    };
    var templateSize = [{x:851,y:315},{x:500,y:500}];
    $scope.templateIndex = 0;
    $scope.selectOnHTMLindex = 1;
    var coverSize = {x:500,y:500};

    var mouseCursor = new Image();
    mouseCursor.src = "images/mouse-01.png";

    var coversProperty = [
        {
            background:"#DEBB2C",
            primaryColor:"black",
            secondaryColor:"#DEBB2C",
            focusFrameColor:"#FF0000"
        },
        {
            background:"#D2D2D2",
            background2:"#F7F3F3",
            primaryColor:"#2D3F66",
            secondaryColor:"#F7F3F3"
        },
        {
            background:"#DEBB2C",
            primaryColor:"black",
            secondaryColor:"#DEBB2C",
            focusFrameColor:"#FF0000"
        },
        {
            background:"#D2D2D2",
            background2:"#F7F3F3",
            primaryColor:"#2D3F66",
            secondaryColor:"#F7F3F3"
        }

    ];
    $scope.selectTheme = function(index){
        $scope.selectOnHTMLindex = index;
        if(index==2){
            index = 0;
            $scope.templateIndex = 1;
        }else if(index == 3){
            index = 1;
            $scope.templateIndex = 1;
        }else{
            $scope.templateIndex = 0;
        }
        $scope.indexOfCover = index;

        $scope.redraw();
    };

    $scope.confirmShare = function(){
        $scope.shareconfirm = !$scope.shareconfirm;
    };
    $scope.shareResult = function(){
        $scope.isLoading = true;
        var c = document.getElementById("resultCanvas");
        var data = c.toDataURL('image/png');
        var encodedPng = data.substring(data.indexOf(',')+1,data.length);
        var decodedPng = Base64Binary.decode(encodedPng);
        PostImageToFacebook($scope.userToken,"result.png","image/png",decodedPng,$scope.result.msg,$scope.makeCover());
    };
    $scope.downloadImage = function(){
        downloadCanvas(this, 'resultCanvas', 'cover-freelance.png');
    };
    $scope.makeCover = function(){
        $scope.loadingText = "กำลังแชร์รูปภาพ และ ส่งคุณไปยังหน้า Facebook";
        $timeout(function(){Facebook.api('me/albums?fields=name&limit=100',function(res){
            angular.forEach(res.data,function(item){
                if (item.name == 'quiz@gth Photos') {
                    profileAlbumId = item.id;
                    Facebook.api(item.id+'/photos?fields=images,link',function(res){
                        var targetImage = res.data[0].id;
                        window.location = 'https://www.facebook.com/profile.php?preview_cover=' + targetImage;
                        $scope.isLoading = false;
                    });
                }
            });
        });},2000)
    };
    $scope.redraw = function(index){
        setDimension();
        var shiftY = 0;
        if($scope.indexOfCover == 1){
            shiftY = +5;
        }
        var centerPos = {x:coverSize.x/2,y:coverSize.y/2 + shiftY };



        var text = $scope.result.title;

        ctx.clearRect(0, 0, c.width, c.height);
        ctx.rect(0,0,c.width,c.height);
        // background draw

        if($scope.indexOfCover == 1){
            var grd=ctx.createRadialGradient(coverSize.x/2,coverSize.y/2,0,coverSize.x/2,coverSize.y,coverSize.x);
            grd.addColorStop(0,coversProperty[$scope.indexOfCover].background2);
            grd.addColorStop(1,coversProperty[$scope.indexOfCover].background );
            //
            ctx.fillStyle = grd;
        }else{
            ctx.fillStyle = coversProperty[$scope.indexOfCover].background;
        }


        ctx.fill();




        ctx.fillStyle =  coversProperty[$scope.indexOfCover].primaryColor;
        ctx.textAlign = 'center';
        ctx.lineWidth = 1;
        if(text == ''){
            text = '  ';
        }else if(text == 'อีเจี้ยบ'){
            text = 'ไก่กาลกิณี';
        }else if(text == 'GTH'){
            text = 'ขอบคุณที่เข้ามาเล่นกิจกรรมกันนะครับ :)';
        }else if(text == 'บีโทเฟ่น'){
            $scope.result.subtitle = 'ห้าม.. ห้าม.. ห้าม.. ห่ามมมม';
            $scope.result.tagText = "Symphony No 5 #Parimeth Wongsatayanon";
        }
        //var text = text.split("").join(String.fromCharCode(8202)+String.fromCharCode(8202)+String.fromCharCode(8202));

        var sara = [
            'ั','ื','่'  ,'ุ' ,'ู'  , 'ี'  ,'้' , '๊'  ,  'ิ'
            ,'็' ,'๋'
        ];
        var processTxt = '';

        console.log(is_android);
        for (var ch = 0 ; ch < text.split("").length ; ch++){
            var chara = text.split("")[ch];
            var addSpace = true;
            for(var i = 0;i < sara.length;i++){
                if(sara[i] == chara){
                    addSpace = false
                }
            }
            var nua = navigator.userAgent.toLowerCase();
            var is_android = ((nua.indexOf('mozilla/5.0') > -1 && nua.indexOf('android ') > -1 && nua.indexOf('applewebkit') > -1) && !(nua.indexOf('chrome') > -1));
            var navU = navigator.userAgent;

            // Android Mobile
            var isAndroidMobile = navU.indexOf('Android') > -1 && navU.indexOf('Mozilla/5.0') > -1 && navU.indexOf('AppleWebKit') > -1;

            // Apple webkit
            var regExAppleWebKit = new RegExp(/AppleWebKit\/([\d.]+)/);
            var resultAppleWebKitRegEx = regExAppleWebKit.exec(navU);
            var appleWebKitVersion = (resultAppleWebKitRegEx === null ? null : parseFloat(regExAppleWebKit.exec(navU)[1]));

            // Chrome
            var regExChrome = new RegExp(/Chrome\/([\d.]+)/);
            var resultChromeRegEx = regExChrome.exec(navU);
            var chromeVersion = (resultChromeRegEx === null ? null : parseFloat(regExChrome.exec(navU)[1]));

            // Native Android Browser
            var isAndroidBrowser = isAndroidMobile && (appleWebKitVersion !== null && appleWebKitVersion < 537) || (chromeVersion !== null && chromeVersion < 37);




            if(addSpace){
                if(!navigator.userAgent.match(/(iPad|iPhone|iPod touch);.*CPU.*OS 7_\d/i) && !isAndroidBrowser){
                    processTxt =  processTxt + String.fromCharCode(8202) + String.fromCharCode(8202) + chara;
                }else{
                    processTxt =  processTxt + chara;
                }
            }else{
                processTxt = processTxt + chara;
            }
        }

        text = processTxt;
        ctx.font = "normal 96px thaisans_neuebold";
        if($scope.indexOfCover == 1){
            ctx.font = "normal 106px thaisans_neuebold";
        }
        var textWidth = (ctx.measureText(text).width);


        if(textWidth > coverSize.x){
            var fontsize = 138;
            while(textWidth > coverSize.x - 80){
                ctx.font = "normal "+fontsize+"px thaisans_neuebold";
                fontsize-=2;
                textWidth = (ctx.measureText(text).width);

                if(textWidth < coverSize.x - 80){
                    ctx.fillText(text, centerPos.x, centerPos.y - 30 );
                }
            }

        }else{

            if($scope.indexOfCover == 1){
                ctx.fillText(text, centerPos.x, centerPos.y - 32 );
            }else{
                ctx.fillText(text, centerPos.x, centerPos.y - 30 );
            }
        }
        //ctx.strokeText(text, centerPos.x, centerPos.y - 32);



        // Draw Text corner frame
        var leftSizeText = (coverSize.x/2 - textWidth/2 ) - 30;
        var rightSizeText = (coverSize.x/2 + textWidth/2 ) + 30;
        var lineStartY;
        var lineHeight = 20;
        ctx.lineWidth = 1.5;
        ctx.fillStyle = coversProperty[$scope.indexOfCover].background;/**/

        if($scope.indexOfCover == 0){
            ctx.strokeStyle = coversProperty[$scope.indexOfCover].focusFrameColor;
            lineStartY = centerPos.y - 30;
            ctx.beginPath();
            ctx.moveTo(leftSizeText,lineStartY);
            ctx.lineTo(leftSizeText,lineStartY + lineHeight);
            ctx.lineTo(leftSizeText + lineHeight,lineStartY + lineHeight);
            ctx.stroke();
            lineStartY = centerPos.y - 80;
            ctx.beginPath();
            ctx.moveTo(leftSizeText,lineStartY);
            ctx.lineTo(leftSizeText,lineStartY - lineHeight);
            ctx.lineTo(leftSizeText + lineHeight,lineStartY - lineHeight);
            ctx.stroke();
            lineStartY = centerPos.y - 80;
            ctx.beginPath();
            ctx.moveTo(rightSizeText,lineStartY);
            ctx.lineTo(rightSizeText,lineStartY - lineHeight);
            ctx.lineTo(rightSizeText - lineHeight,lineStartY - lineHeight);
            ctx.stroke();
            lineStartY = centerPos.y - 30;
            ctx.beginPath();
            ctx.moveTo(rightSizeText,lineStartY);
            ctx.lineTo(rightSizeText,lineStartY + lineHeight);
            ctx.lineTo(rightSizeText - lineHeight,lineStartY + lineHeight);
            ctx.stroke();
        }

        // Draw black label เฮ้อ อยากกินเหล้าจุง
        ctx.font = "normal 42px thai_sans_literegular";
        var subText = $scope.result.subtitle;
        var subtextWidth = (ctx.measureText(subText).width);
        var rectHeight = 46;
        ctx.beginPath();
        ctx.rect((centerPos.x - subtextWidth/2) - 20,centerPos.y + 5,subtextWidth+40,rectHeight);
        ctx.fillStyle = coversProperty[$scope.indexOfCover].primaryColor;
        ctx.fill();
        ctx.fillStyle = coversProperty[$scope.indexOfCover].secondaryColor;
        ctx.fillText(subText, centerPos.x, centerPos.y + 40);

        // Draw Square

        if($scope.indexOfCover == 1){
            ctx.drawImage(mouseCursor,((centerPos.x + subtextWidth/2) - 20),centerPos.y - 5 + rectHeight + 2,18,28);


            var recs =[
                {
                    x:(centerPos.x - subtextWidth/2) - 22,
                    y:centerPos.y + 2,
                    w:5,
                    h:5
                },
                {
                    x:(centerPos.x),
                    y:centerPos.y + 2,
                    w:5,
                    h:5
                },
                {
                    x:(centerPos.x + subtextWidth/2) + 18,
                    y:centerPos.y + 2,
                    w:5,
                    h:5
                },
                {
                    x:(centerPos.x - subtextWidth/2) - 22,
                    y:centerPos.y + rectHeight + 2,
                    w:5,
                    h:5
                },
                {
                    x:(centerPos.x),
                    y:centerPos.y + rectHeight + 2,
                    w:5,
                    h:5
                },
                {
                    x:(centerPos.x + subtextWidth/2) + 18,
                    y:centerPos.y + rectHeight + 2,
                    w:5,
                    h:5
                }
            ];

            angular.forEach(recs,function(rec){
                ctx.beginPath();
                ctx.rect(rec.x,rec.y,rec.w,rec.h);
                ctx.strokeStyle = coversProperty[$scope.indexOfCover].secondaryColor;
                ctx.lineWidth = 1;
                ctx.strokeRect(rec.x,rec.y,rec.w,rec.h);
                ctx.fillStyle = coversProperty[$scope.indexOfCover].primaryColor;
                ctx.fill();
            });

        }

        ctx.font = "normal 32px thai_sans_literegular";
        var tagText = $scope.result.tagText;
        var tagTextWidth = (ctx.measureText(tagText).width);
        ctx.fillStyle = coversProperty[$scope.indexOfCover].primaryColor;
        ctx.fillText(tagText, centerPos.x, centerPos.y + rectHeight + 38);
        ctx.fillStyle ="rgba(0, 0, 0, 0.4)";
        ctx.font = "normal 8px thaisans_neueregular";
        ctx.textAlign = 'right';
        ctx.fillText('#FreelanceTheMovie',coverSize.x-5,coverSize.y-15);
        ctx.fillText('http://freelancethemovie.com/facebookcover',coverSize.x-5,coverSize.y-5);

       // alert(c);
        var data = c.toDataURL('image/png');
        
        var image = new Image();
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = data;
        document.getElementById('result').innerHTML = '';
        document.getElementById('result').appendChild(image);

    };
    $scope.logout = function(){
        Facebook.logout(function(response){
            getLoginStatus();
        });

    };

    $scope.login = function(){
        Facebook.login(function(response){
                if (response.status == 'connected') {
                    $scope.isLogin = LoginStatus.loggin;

                    getLoginStatus();
                }
            },
            {
                scope: 'publish_actions,user_photos',
                return_scopes: true
            })
    };
    var setDimension = function(){
        coverSize = templateSize[$scope.templateIndex];
        if(window.devicePixelRatio == 2 || true){
            c.width = coverSize.x*2;
            c.height = coverSize.y*2;
            c.style.width = coverSize +"px";
            //c.style.height = "315px";
            ctx.scale(2,2);

        }

    };
    var getLoginStatus = function() {
        c = document.getElementById("resultCanvas");
        ctx = c.getContext("2d");

        setDimension();
        $scope.redraw();
        $scope.$watch('result', function(newVal, oldVal){
            $scope.redraw();
        }, true);
        var promise = $interval(function(){
            $scope.redraw();
            console.log('redraw');
            if (isFontLoaded){
                $interval.cancel(promise);
            }
        },3000);
        Facebook.getLoginStatus(function(response) {

            if(response.status === 'connected') {
                $scope.isLogin = LoginStatus.loggin;
                $scope.userToken = response.authResponse.accessToken;

                Facebook.api('me/',function(res){



                });

            } else {
                console.log();
                $scope.isLogin = LoginStatus.logout;
            }
        })
    };

    setTimeout(function(){
        console.log('ฮั่นแน่ ใครมาแอบอ่าน'+IsLoadedFonts('thai_sans_literegular'));
        if(!IsLoadedFonts('thai_sans_literegular')){

        }
    },100);
    getLoginStatus();
    document.getElementById('download').addEventListener('click', function() {
        downloadCanvas(this, 'resultCanvas', 'freelance-cover.png');
    }, false);
});


function IsLoadedFonts()
{
    var Args = arguments;
    var obj = document.getElementById('fontCanvas');
    var ctx = obj.getContext("2d");
    var baseFont = (/chrome/i.test(navigator.userAgent))?'time new roman':'arial';
    //................
    function getImg(fon)
    {
        ctx.clearRect(0, 0, (obj).width, (obj).height);
        ctx.fillStyle = 'rgba(0,0,0,1.0)';
        ctx.fillRect( 0, 0, 40, 40 );
        ctx.font = '20px '+ fon;
        ctx.textBaseline = "top";
        ctx.fillStyle = 'rgba(255,255,255,1.0)';
        ctx.fillText( '\u0630', 18, 5 );
        return ctx.getImageData( 0, 0, 40, 40 );
    };
    //..............
    for(var i1=0; i1<Args.length; i1++)
    {
        data1 = getImg(Args[i1]);
        data2 = getImg(baseFont);
        var isLoaded = false;
        //...........
        for (var i=0; i<data1.data.length; i++)
        {
            if(data1.data[i] != data2.data[i])
            {isLoaded = true; break;}
        }
        //..........
        if(!isLoaded)
            return false;
    }
    return true;
};