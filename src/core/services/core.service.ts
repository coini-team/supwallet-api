import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';
import { Buffer } from 'buffer';
import * as fs from 'fs';

@Injectable()
export class CoreService {

    /**
     * 
     * @param phone 
     */
    async generateQR(text) {
        try {
            const qrCodeDataUrl = await QRCode.toDataURL(text, { errorCorrectionLevel: 'H' });
            const buffer = Buffer.from(qrCodeDataUrl.replace(/^data:image\/png;base64,/, ''), 'base64');
            // Specify the path and name of the file
            const filePath = `public/${text}.png`;
            // Write the buffer to a JPG file
            fs.writeFile(filePath, buffer, (err) => {
                if (err) throw err;
                console.log('The file has been saved!');
            });
            return qrCodeDataUrl;
        } catch (error) {
            console.error('Error generating QR code', error);
            throw error;
        }
    }
}
