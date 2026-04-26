import type { StockResult } from '@packalert/types';

export async function notifyDiscord(result: StockResult): Promise<void> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) throw new Error('DISCORD_WEBHOOK_URL is not set');

  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      embeds: [
        {
          title: `🟢 IN STOCK: ${result.product.name}`,
          url: result.product.url,
          color: 0x00ff88,
          fields: [
            { name: 'Retailer', value: result.product.retailer, inline: true },
            { name: 'Price', value: result.price ?? 'Unknown', inline: true },
          ],
          footer: { text: 'PackAlert.gg' },
          timestamp: result.timestamp.toISOString(),
        },
      ],
    }),
  });
}
