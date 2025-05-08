var owl = $('.owl-carousel');
var autoplay = true;

owl.owlCarousel({
    items: 4,
    loop: true,
    margin: 10,
    autoplay: autoplay,
    autoplayTimeout: 3000,
    autoplayHoverPause: true
});

// Buton tıklama işlevi
$('.toggle-autoplay').on('click', function() {
    if (autoplay) {
        // Autoplay'i durdur
        owl.trigger('stop.owl.autoplay');
        $(this).html('<i class="fa-solid fa-play"></i>'); // Sadece ikon değiştir
        autoplay = false; // Durdu
    } else {
        // Autoplay'i başlat
        owl.trigger('play.owl.autoplay', [1000]);
        $(this).html('<i class="fa-solid fa-pause"></i>'); // Sadece ikon değiştir
        autoplay = true; // Başladı
    }
});
