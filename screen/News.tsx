import React, { useEffect, useState } from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

interface Article {
  urlToImage: string;
  title: string;
  description: string;
  content: string;
}

const News = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [expandedArticleIndex, setExpandedArticleIndex] = useState<number | null>(null);

  useEffect(() => {
    fetch('https://newsapi.org/v2/top-headlines?country=us&apiKey=d369aa11ceda4c97ab8ae4e69d563d1a')
      .then(response => response.json())
      .then(data => setArticles(data.articles))
      .catch(error => console.error(error));
  }, []);

  const toggleExpand = (index: number) => {
    setExpandedArticleIndex(expandedArticleIndex === index ? null : index);
  };

  const renderItem = ({ item, index }: { item: Article; index: number }) => (
    <TouchableOpacity style={styles.articleContainer} onPress={() => toggleExpand(index)}>
      <Image source={{ uri: item.urlToImage }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>

      {expandedArticleIndex === index && (
        <Text style={styles.expandedText}>{item.content || 'No additional content available.'}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={articles}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

const styles = StyleSheet.create({
  articleContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  description: {
    fontSize: 14,
    color: '#333',
  },
  expandedText: {
    fontSize: 14,
    color: '#555',
    marginTop: 10,
  },
});

export default News;
