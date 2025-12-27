document.addEventListener('DOMContentLoaded', () => {
    const { installationStart, downloadInstallerProgress, installationFinish, uwu } = lw
    function byteToMegabyte(bytes) {
        bytes = Number(bytes)
        return (bytes / 1_048_576).toFixed(1)
    }
    installationStart(() => {
        $('#current_progress_title').html('Идёт загрузка...')
        $('#progress_bar').removeAttr('hidden')
        $('#current_progress_text_container').removeAttr('hidden')
        $('#footer_text').attr('hidden', 'hidden')
    })
    downloadInstallerProgress((current, size) => {
        console.log(current, size)
        $('#current_progress_text').html(`${byteToMegabyte(current)} / ${byteToMegabyte(size)}МБ`)
        $('#current_progress').css('width', `${current / size * 100}%`)
    })
    installationFinish(() => {
        $('#progress_bar').attr('hidden', 'hidden')
        $('#current_progress_title').html('Запускаем установщик...')
    })
    uwu()
})