/**
 * Cautions:
 * - This plugin may cause your bot to be banned by Facebook because of spamming reactions.
 * - Use this plugin at your own risk.
 */

export const config = {
    name: "autoreact",
    version: "0.0.1-xaviabot-port-refactor",
    credits: "Clarence DK",
    description: "random letters heart react"
};

export function onCall({ message }) {
    if (message.body.length == 0) return;

    const conditions = ["check","ndt","prefix"];

    if (conditions.some(word => message.body.toLowerCase().includes(word))) {
        return message.react("✅");
      
    }

    
  //message.react("🆑");
}