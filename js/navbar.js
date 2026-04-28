document.addEventListener('DOMContentLoaded', function () {
    var toggles = document.querySelectorAll('.dropdown-toggle');

    toggles.forEach(function (toggle) {
        toggle.addEventListener('click', function (e) {
            e.preventDefault();
            var dropdown = this.closest('.dropdown');
            var isOpen = dropdown.classList.contains('open');

            document.querySelectorAll('.dropdown').forEach(function (d) {
                d.classList.remove('open');
            });

            if (!isOpen) dropdown.classList.add('open');
        });
    });

    document.addEventListener('click', function (e) {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown').forEach(function (d) {
                d.classList.remove('open');
            });
        }
    });
});
