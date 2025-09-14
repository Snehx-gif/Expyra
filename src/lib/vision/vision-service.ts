
"use strict";

import {
  GoogleAuth,
  JSONClient,
} from "google-auth-library/build/src/auth/googleauth";

export class VisionService {
  private readonly GOOGLE_AUTH_SCOPES = [
    "https://www.googleapis.com/auth/cloud-vision",
  ];
  private readonly VISION_API_URL = "https://vision.googleapis.com/v1/images:annotate";

  private auth: GoogleAuth<JSONClient>;

  constructor(visionApiKey: string) {
    this.auth = new GoogleAuth({
      credentials: JSON.parse(visionApiKey),
      scopes: this.GOOGLE_AUTH_SCOPES,
    });
  }

  async detectText(
    image: string,
  ): Promise<any> {
    try {
      const client = await this.auth.getClient();

      const request = {
        requests: [
          {
            image: {
              content: image,
            },
            features: [
              {
                type: "TEXT_DETECTION",
                maxResults: 1,
              },
            ],
          },
        ],
      };

      const { data } = await client.request<any>({
        url: this.VISION_API_URL,
        method: "POST",
        data: request,
      });

      return data;
    } catch (e: any) {
      console.log(e);
      throw e;
    }
  }
}
