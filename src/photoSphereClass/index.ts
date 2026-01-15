import { Viewer } from "@photo-sphere-viewer/core";
import "@photo-sphere-viewer/core/index.css";
import "@photo-sphere-viewer/markers-plugin/index.css";
import { MarkersPlugin } from "@photo-sphere-viewer/markers-plugin";
import { styleEnum } from "./dict";
export type PanoramaClickEvent = {
  yaw: number;
  pitch: number;
};
export interface ApiMarkersType  {
  id: string;
  position: {
    yaw: number;
    pitch: number;
  };
  text: string;
  style: string;
}
export class PhotoSphere {
  viewer: Viewer;
  markersPlugin: MarkersPlugin;
  constructor(container: HTMLElement, panorama?: string) {
    this.viewer = new Viewer({
      container,
      panorama,
      navbar: false,
      plugins: [MarkersPlugin],
    });

    const plugin = this.viewer.getPlugin<MarkersPlugin>(MarkersPlugin);
    if (!plugin) {
      throw new Error("MarkersPlugin init failed");
    }
    this.markersPlugin = plugin;
  }

  setPanorama(url: string) {
    return this.viewer.setPanorama(url);
  }

  clearMarkers() {
    this.markersPlugin.clearMarkers();
  }
  addMarker(marker: ApiMarkersType) {
    this.markersPlugin.addMarker({
      id: marker.id,
      position: {
        yaw: marker.position.yaw,
        pitch: marker.position.pitch,
      },
      html: styleEnum(marker.text)[marker.style]?.html,
    });
  }
  setMarkers(markers: ApiMarkersType[]) {
    const newMarkers = markers.map((item) => {
      return {
        id: item.id,
        position: {
          yaw: item.position.yaw,
          pitch: item.position.pitch,
        },
        html: styleEnum(item.text)[item.style]?.html,
      }
    })
    this.markersPlugin.setMarkers(newMarkers);
  }

  destroy() {
    this.viewer.destroy();
  }

  private clickHandlers = new Map<
    (e: PanoramaClickEvent) => void,
    (evt: any) => void
  >();
  addClickListener(handler: (e: PanoramaClickEvent) => void) {
    const internalHandler = (evt: any) => {
      handler({
        yaw: evt.data.yaw,
        pitch: evt.data.pitch,
      });
    };

    this.clickHandlers.set(handler, internalHandler);
    this.viewer.addEventListener("click", internalHandler);
  }
  removeClickListener(handler: (e: PanoramaClickEvent) => void) {
    const internal = this.clickHandlers.get(handler);
    if (!internal) return;

    this.viewer.removeEventListener("click", internal);
    this.clickHandlers.delete(handler);
  }
  private markerClickHandlers = new Map<
    (marker: any) => void,
    (e: any) => void
  >();

  onMarkerClick(handler: (marker: any) => void) {
    const internal = (e: any) => handler(e.marker);
    this.markerClickHandlers.set(handler, internal);
    this.markersPlugin.addEventListener("select-marker", internal);
  }

  offMarkerClick(handler: (marker: any) => void) {
    const internal = this.markerClickHandlers.get(handler);
    if (!internal) return;

    this.markersPlugin.removeEventListener("select-marker", internal);
    this.markerClickHandlers.delete(handler);
  }
}
