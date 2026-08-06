import occasions from "../../data/occasions.json";
import relationships from "../../data/relationships.json";
import hobbies from "../../data/hobbies.json";
import professions from "../../data/professions.json";
import products from "../../data/products.json";
import addons from "../../data/addons.json";
import styles from "../../data/styles.json";
import materials from "../../data/materials.json";
import productionMethods from "../../data/production_methods.json";

export type KnowledgeEntity = {
  id: string;
  name: string;
  description: string;
  averagePrice: number;
  productionTimeHours: number | null;
  technologies: string[];
  partners: string[];
  occasions: string[];
  suitableFor: string[];
  recommendedAddons: string[];
  aliases?: string[];
  preferredProducts?: string[];
  materials?: string[];
  constructorId?: string;
  emoji?: string;
};

export type GiftKnowledgeBase = {
  occasions: KnowledgeEntity[];
  relationships: KnowledgeEntity[];
  hobbies: KnowledgeEntity[];
  professions: KnowledgeEntity[];
  products: KnowledgeEntity[];
  addons: KnowledgeEntity[];
  styles: KnowledgeEntity[];
  materials: KnowledgeEntity[];
  productionMethods: KnowledgeEntity[];
};

export const giftKnowledgeBase: GiftKnowledgeBase = {
  occasions: occasions as KnowledgeEntity[],
  relationships: relationships as KnowledgeEntity[],
  hobbies: hobbies as KnowledgeEntity[],
  professions: professions as KnowledgeEntity[],
  products: products as KnowledgeEntity[],
  addons: addons as KnowledgeEntity[],
  styles: styles as KnowledgeEntity[],
  materials: materials as KnowledgeEntity[],
  productionMethods: productionMethods as KnowledgeEntity[],
};

export function getKnowledgeEntityById(
  collection: KnowledgeEntity[],
  id: string | undefined,
): KnowledgeEntity | undefined {
  if (!id) return undefined;
  return collection.find((item) => item.id === id);
}

export function matchEntitiesByAliases(
  collection: KnowledgeEntity[],
  queryLower: string,
): KnowledgeEntity[] {
  return collection.filter((item) => {
    const aliases = item.aliases ?? [item.name.toLowerCase()];
    return aliases.some((alias) => queryLower.includes(alias.toLowerCase()));
  });
}
