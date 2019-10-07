from tethys_sdk.base import TethysAppBase, url_map_maker


class GrdcViewer(TethysAppBase):
    """
    Tethys app class for GRDC Viewer.
    """

    name = 'GRDC Viewer'
    index = 'grdc_viewer:home'
    icon = 'grdc_viewer/images/logo.png'
    package = 'grdc_viewer'
    root_url = 'grdc-viewer'
    color = '#669FD1'
    description = 'This app is a light viewer for the Global Runoff Data Centre (GRDC) Data'
    tags = ''
    enable_feedback = False
    feedback_emails = []

    def url_maps(self):
        """
        Add controllers
        """
        UrlMap = url_map_maker(self.root_url)

        url_maps = (
            UrlMap(
                name='home',
                url='grdc-viewer',
                controller='grdc_viewer.controllers.home'
            ),
            UrlMap(
                name='region_map',
                url='grdc-viewer/region_map',
                controller='grdc_viewer.controllers.region_map'
            ),
            UrlMap(
                name='get_continent',
                url='grdc-viewer/get_continent',
                controller='grdc_viewer.controllers.get_continent'
            ),
            UrlMap(
                name='get_dailyData',
                url='grdc-viewer/get-dailyData',
                controller='grdc_viewer.controllers.get_dailyData'
            ),
            UrlMap(
                name='get_monthlyData',
                url='grdc-viewer/get-monthlyData',
                controller='grdc_viewer.controllers.get_monthlyData'
            ),
            UrlMap(
                name='download_dailyData',
                url='grdc-viewer/download-dailyData',
                controller='grdc_viewer.controllers.download_dailyData'
            ),
            UrlMap(
                name='download_monthlyData',
                url='grdc-viewer/download-monthlyData',
                controller='grdc_viewer.controllers.download_monthlyData'
            ),
            UrlMap(
                name='about',
                url='grdc-viewer/about',
                controller='grdc_viewer.controllers.about'
            ),
        )

        return url_maps
