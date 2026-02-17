import puppeteer from "puppeteer";
import handlebars from "handlebars";
import fs from "fs/promises";
import path from "path";
import config from "../config";
import { PDFOptions } from "../types";
import logger from "../utils/logger";

class PDFService {
  private templatePath: string;

  constructor() {
    this.templatePath = path.join(__dirname, "../templates/invoice.hbs");
    this.ensureDirectories();
    this.registerHelpers();
  }

  private async ensureDirectories(): Promise<void> {
    try {
      await fs.mkdir(config.pdf.storagePath, { recursive: true });
      await fs.mkdir(path.dirname(this.templatePath), { recursive: true });
    } catch (error) {
      logger.error("Error creating directories:", error);
    }
  }

  private registerHelpers(): void {
    handlebars.registerHelper("formatCurrency", (amount: number) => {
      return `${config.company.defaultCurrencySymbol}${amount.toLocaleString(
        "en-NG",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        },
      )}`;
    });

    handlebars.registerHelper("formatDate", (date: Date) => {
      return new Date(date).toLocaleDateString("en-NG", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    });

    handlebars.registerHelper("increment", (value: number) => {
      return value + 1;
    });

    handlebars.registerHelper("eq", (a: any, b: any) => {
      return a === b;
    });
  }

  async generatePDF(options: PDFOptions): Promise<string> {
    const { invoice, company, customer } = options;

    try {
      // Generate HTML from template
      const html = await this.generateHTML(invoice, company, customer);

      // Generate filename
      const filename = this.generateFilename(invoice, customer);
      const filepath = path.join(config.pdf.storagePath, filename);

      // Launch puppeteer and generate PDF
      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "networkidle0" });

      await page.pdf({
        path: filepath,
        format: "A4",
        printBackground: true,
        margin: {
          top: "20px",
          right: "20px",
          bottom: "20px",
          left: "20px",
        },
      });

      await browser.close();

      logger.info(`PDF generated successfully: ${filename}`);
      return filepath;
    } catch (error) {
      logger.error("Error generating PDF:", error);
      throw error;
    }
  }

  private async generateHTML(
    invoice: any,
    company: any,
    customer: any,
  ): Promise<string> {
    // Read template
    let template: string;
    try {
      template = await fs.readFile(this.templatePath, "utf-8");
    } catch (error) {
      // If template doesn't exist, use default
      template = this.getDefaultTemplate();
      await fs.writeFile(this.templatePath, template, "utf-8");
    }

    const compiled = handlebars.compile(template);

    // Prepare data
    const data = {
      invoice,
      company,
      customer,
      currencySymbol: config.company.defaultCurrencySymbol,
      currentDate: new Date().toLocaleDateString("en-NG"),
    };

    return compiled(data);
  }

  private generateFilename(invoice: any, customer: any): string {
    const type = invoice.invoiceType === "proforma" ? "Proforma" : "Invoice";
    const customerName = customer.name.replace(/[^a-z0-9]/gi, "_");
    const date = new Date(invoice.invoiceDate).toISOString().split("T")[0];
    return `${type}_${invoice.invoiceNumber}_${customerName}_${date}.pdf`;
  }

  private getDefaultTemplate(): string {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{#if (eq invoice.invoiceType 'proforma')}}Proforma Invoice{{else}}Invoice{{/if}}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Segoe UI', Arial, sans-serif; color: #333; line-height: 1.6; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 30px; border-bottom: 3px solid {{company.primaryColor}}; padding-bottom: 20px; }
        .company-info { flex: 1; }
        .company-name { font-size: 28px; font-weight: bold; color: {{company.primaryColor}}; margin-bottom: 10px; }
        .company-details { font-size: 12px; color: #666; }
        .logo { max-width: 150px; height: auto; }
        .invoice-title { text-align: right; }
        .invoice-type { font-size: 32px; font-weight: bold; color: {{company.primaryColor}}; text-transform: uppercase; }
        .receipt-number { font-size: 14px; color: #666; margin-top: 5px; }
        .billing-info { display: flex; justify-content: space-between; margin: 30px 0; }
        .bill-to { flex: 1; }
        .section-title { font-weight: bold; color: {{company.primaryColor}}; margin-bottom: 10px; font-size: 14px; }
        .info-block { font-size: 13px; }
        .invoice-meta { text-align: right; }
        table { width: 100%; border-collapse: collapse; margin: 30px 0; }
        thead { background-color: {{company.primaryColor}}; color: white; }
        th { padding: 12px; text-align: left; font-weight: 600; }
        td { padding: 10px 12px; border-bottom: 1px solid #eee; }
        tbody tr:hover { background-color: #f9f9f9; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .totals { margin-left: auto; width: 300px; }
        .total-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
        .total-row.subtotal { font-weight: 600; }
        .total-row.grand-total { font-size: 18px; font-weight: bold; color: {{company.primaryColor}}; border-top: 2px solid {{company.primaryColor}}; border-bottom: none; margin-top: 10px; padding-top: 15px; }
        .account-details { margin: 40px 0; padding: 20px; background-color: #f8f9fa; border-left: 4px solid {{company.primaryColor}}; }
        .account-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-top: 15px; }
        .account-item { }
        .account-label { font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: 0.5px; }
        .account-value { font-weight: 600; margin-top: 3px; }
        .signature-section { margin-top: 60px; }
        .signature-line { border-top: 2px solid #333; width: 250px; margin-top: 50px; padding-top: 10px; text-align: center; font-size: 12px; }
        .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 11px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="company-info">
                {{#if company.logo}}
                <img src="{{company.logo}}" alt="{{company.name}}" class="logo">
                {{/if}}
                <div class="company-name">{{company.name}}</div>
                <div class="company-details">
                    {{#if company.address}}{{company.address}}<br>{{/if}}
                    {{#if company.city}}{{company.city}}{{#if company.state}}, {{company.state}}{{/if}}<br>{{/if}}
                    {{#if company.phone}}Tel: {{company.phone}}<br>{{/if}}
                    {{#if company.email}}Email: {{company.email}}{{/if}}
                </div>
            </div>
            <div class="invoice-title">
                <div class="invoice-type">{{#if (eq invoice.invoiceType 'proforma')}}PROFORMA{{else}}INVOICE{{/if}}</div>
                <div class="receipt-number">{{#if (eq invoice.invoiceType 'proforma')}}Receipt #{{else}}Invoice #{{/if}} {{invoice.invoiceNumber}}</div>
                <div class="receipt-number">Date: {{formatDate invoice.invoiceDate}}</div>
            </div>
        </div>

        <div class="billing-info">
            <div class="bill-to">
                <div class="section-title">BILLED TO</div>
                <div class="info-block">
                    <strong>{{customer.name}}</strong><br>
                    {{#if customer.address}}{{customer.address}}<br>{{/if}}
                    {{#if customer.city}}{{customer.city}}{{#if customer.state}}, {{customer.state}}{{/if}}<br>{{/if}}
                    {{#if customer.email}}{{customer.email}}<br>{{/if}}
                    {{#if customer.phone}}{{customer.phone}}{{/if}}
                </div>
            </div>
            <div class="invoice-meta">
                {{#if invoice.dueDate}}
                <div class="section-title">DUE DATE</div>
                <div class="info-block">{{formatDate invoice.dueDate}}</div>
                {{/if}}
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th style="width: 50px;">S/N</th>
                    <th>DESCRIPTION</th>
                    <th class="text-center" style="width: 80px;">QTY</th>
                    <th class="text-right" style="width: 120px;">UNIT PRICE</th>
                    <th class="text-right" style="width: 120px;">TOTAL</th>
                </tr>
            </thead>
            <tbody>
                {{#each invoice.items}}
                <tr>
                    <td class="text-center">{{increment @index}}</td>
                    <td>{{this.description}}</td>
                    <td class="text-center">{{this.quantity}}</td>
                    <td class="text-right">{{formatCurrency this.unitPrice}}</td>
                    <td class="text-right">{{formatCurrency this.total}}</td>
                </tr>
                {{/each}}
            </tbody>
        </table>

        <div class="totals">
            <div class="total-row subtotal">
                <span>Sub Total</span>
                <span>{{formatCurrency invoice.subtotal}}</span>
            </div>
            {{#each invoice.additionalCharges}}
            <div class="total-row">
                <span>{{this.label}}{{#if this.isPercentage}} ({{this.value}}%){{/if}}</span>
                <span>{{formatCurrency this.amount}}</span>
            </div>
            {{/each}}
            {{#if invoice.outstandingBill}}
            <div class="total-row">
                <span>Outstanding Bill</span>
                <span>{{formatCurrency invoice.outstandingBill}}</span>
            </div>
            {{/if}}
            <div class="total-row grand-total">
                <span>Grand Total</span>
                <span>{{formatCurrency invoice.grandTotal}}</span>
            </div>
        </div>

        <div class="account-details">
            <div class="section-title">ACCOUNT DETAILS</div>
            <div class="account-grid">
                {{#each company.accountDetails}}
                <div class="account-item">
                    <div class="account-label">BANK NAME</div>
                    <div class="account-value">{{this.bankName}}</div>
                    <div class="account-label" style="margin-top: 10px;">ACCOUNT NUMBER</div>
                    <div class="account-value">{{this.accountNumber}}</div>
                    <div class="account-label" style="margin-top: 10px;">ACCOUNT NAME</div>
                    <div class="account-value">{{this.accountName}}</div>
                </div>
                {{/each}}
            </div>
        </div>

        {{#if company.signature}}
        <div class="signature-section">
            <div class="signature-line">
                Authorized Signature
            </div>
        </div>
        {{/if}}

        <div class="footer">
            Thank you for your business! All sales are final.
        </div>
    </div>
</body>
</html>`;
  }
}

export default new PDFService();
