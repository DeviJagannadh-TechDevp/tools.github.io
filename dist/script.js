$(document).ready(function() {
    if (localStorage.getItem('ribbonCut') != 'cut') {
        $('.ribbon').delay(2000).fadeIn();
        $('#imgFollow').delay(2000).fadeIn();
    }

    $(".ribbon").click(function() {
        $(".ribbon--l").addClass("hide");
        $(".ribbon--r").addClass("hide");
        $(".bow").addClass("hide");
        $("#imgFollow").hide();
        localStorage.setItem('ribbonCut', 'cut');
        
        // Countdown and confirmation
        var count = 5;
        var countdown = setInterval(function() {
            if (count > 0) {
                if (count === 5) {
                    alert("Get ready to witness SU's art website which is 99% complete!");
                }
                confirm("Countdown: " + count);
                count--;
            } else {
                clearInterval(countdown);
                // Redirect to another URL
                window.location.href = "https://radhasurekha.netlify.app/";
            }
        }, 1000);
    });
});

$(document).mousemove(function(e) {
    $('#imgFollow').offset({
        left: e.pageX + 30,
        top: e.pageY - 20
    });
    $('#imgFollow').css('z-index', '1000');
});
